<?php
// PHP 8.2+; PDO SQLite and fileinfo. No Cloudflare services required.
declare(strict_types=1);
function configuration(): array {
    $file = getenv('REGARDIN_CONFIG') ?: dirname(__DIR__) . '/private/config.php';
    if (!is_file($file)) return ['enabled' => false];
    $config = require $file;
    if (!is_array($config)) throw new RuntimeException('Invalid server configuration.');
    return $config;
}
function ready(array $c): bool {
    return !empty($c['enabled']) && extension_loaded('pdo_sqlite') && extension_loaded('fileinfo')
        && preg_match('~^https://[^/]+$~', $c['origin'] ?? '')
        && strlen($c['secret'] ?? '') >= 32 && strlen($c['operator_token'] ?? '') >= 32
        && filter_var($c['from_email'] ?? '', FILTER_VALIDATE_EMAIL)
        && filter_var($c['notification_email'] ?? '', FILTER_VALIDATE_EMAIL)
        && isset($c['storage']) && is_dir($c['storage']) && is_writable($c['storage'])
        && !inside_public($c['storage']);
}
function inside_public(string $path): bool {
    $root = realpath($_SERVER['DOCUMENT_ROOT'] ?? '') ?: '';
    $storage = realpath($path) ?: '';
    return $root !== '' && ($storage === $root || str_starts_with($storage, $root . DIRECTORY_SEPARATOR));
}
function database(array $c): PDO {
    $db = new PDO('sqlite:' . $c['storage'] . '/enquiries.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
    $db->exec(file_get_contents(__DIR__ . '/schema.sql'));
    chmod($c['storage'] . '/enquiries.sqlite', 0600);
    return $db;
}
function session_start_private(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('regardin_session');
    if (!session_start(['cookie_httponly' => true, 'cookie_secure' => true, 'cookie_samesite' => 'Lax', 'use_strict_mode' => true])) throw new RuntimeException('Private sessions are unavailable.');
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
}
function uuid(): string {
    $b = random_bytes(16); $b[6] = chr((ord($b[6]) & 15) | 64); $b[8] = chr((ord($b[8]) & 63) | 128);
    $h = bin2hex($b);
    return substr($h, 0, 8) . '-' . substr($h, 8, 4) . '-' . substr($h, 12, 4) . '-' . substr($h, 16, 4) . '-' . substr($h, 20);
}
function escape(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function fields(array $input): array {
    $limits = ['name'=>100,'phone'=>40,'email'=>254,'suburb'=>100,'service'=>80,'brief'=>5000,'timing'=>150];
    $data=[];
    foreach ($limits as $key=>$max) {
        if (isset($input[$key]) && !is_string($input[$key])) throw new InvalidArgumentException('Please check your ' . $key . '.');
        $value=trim($input[$key] ?? '');
        if (($key !== 'timing' && $value === '') || strlen($value) > $max || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', $value)) throw new InvalidArgumentException('Please check your ' . $key . '.');
        $data[$key]=$value;
    }
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $data['email'])) throw new InvalidArgumentException('Please enter a valid email address.');
    if (!preg_match('/^[+\d\s().-]{7,40}$/', $data['phone']) || strlen(preg_replace('/\D/', '', $data['phone'])) < 7) throw new InvalidArgumentException('Please enter a valid phone number.');
    if (!in_array($data['service'], json_decode(file_get_contents(__DIR__.'/services.json'), true), true)) throw new InvalidArgumentException('Please select an available service.');
    if (strlen($data['brief']) < 20) throw new InvalidArgumentException('Please add more detail to your brief.');
    return $data;
}
function files(array $input): array {
    if (!$input) return [];
    if (!is_array($input['name'] ?? null)) throw new InvalidArgumentException('Invalid attachments.');
    $out=[]; $mime=new finfo(FILEINFO_MIME_TYPE);
    foreach ($input['name'] as $i=>$name) {
        $error=$input['error'][$i] ?? UPLOAD_ERR_NO_FILE;
        if ($error === UPLOAD_ERR_NO_FILE) continue;
        $path=$input['tmp_name'][$i] ?? '';
        if ($error !== UPLOAD_ERR_OK || !is_uploaded_file($path)) throw new InvalidArgumentException('An attachment could not be uploaded.');
        $size=filesize($path); $type=$mime->file($path);
        if ($size > 8*1024*1024 || !in_array($type, ['image/jpeg','image/png','image/webp','application/pdf'], true)) throw new InvalidArgumentException('Use JPEG, PNG, WebP or PDF files, each 8 MB or smaller.');
        $out[]=['name'=>substr(preg_replace('/[\x00-\x1F]/', '', basename($name)),0,200),'path'=>$path,'size'=>$size,'type'=>$type,'hash'=>hash_file('sha256',$path)];
    }
    if (count($out)>5) throw new InvalidArgumentException('Attach no more than five files.');
    return $out;
}
function take_limit(PDO $db, string $identity, int $now): bool {
    $start=intdiv($now,600)*600;
    $s=$db->prepare('INSERT INTO rate_limits(identity_hash,window_start,count) VALUES(?,?,1) ON CONFLICT(identity_hash) DO UPDATE SET count=CASE WHEN window_start=excluded.window_start THEN count+1 ELSE 1 END, window_start=excluded.window_start RETURNING count');
    $s->execute([$identity,$start]); return $s->fetchColumn()<=5;
}
function store(PDO $db, array $c, array $data, string $key, array $files): array {
    $payload=hash('sha256',json_encode([$data,array_map(fn($f)=>[$f['name'],$f['size'],$f['hash']],$files)],JSON_THROW_ON_ERROR));
    $id=uuid(); $now=gmdate('c');
    $db->beginTransaction();
    try {
        $s=$db->prepare('INSERT INTO enquiries(id,idempotency_key,payload_hash,name,phone,email,suburb,service,brief,timing,created_at,upload_status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(idempotency_key) DO NOTHING');
        $s->execute([$id,$key,$payload,...array_values($data),$now,$files?'pending':'none']);
        if ($s->rowCount()===0) {
            $q=$db->prepare('SELECT id,payload_hash,upload_status FROM enquiries WHERE idempotency_key=?'); $q->execute([$key]); $old=$q->fetch(PDO::FETCH_ASSOC);
            $db->commit();
            if (!hash_equals($old['payload_hash'],$payload)) throw new InvalidArgumentException('This enquiry key belongs to a different brief. Reload the form.');
            return ['receipt'=>$old['id'],'duplicate'=>true,'uploadStatus'=>$old['upload_status']];
        }
        $s=$db->prepare('INSERT INTO notification_outbox(enquiry_id,next_attempt_at) VALUES(?,?)'); $s->execute([$id,$now]);
        $db->commit();
    } catch(Throwable $e) { if ($db->inTransaction()) $db->rollBack(); throw $e; }
    $status=$files?'complete':'none';
    foreach($files as $file) {
        $fileId=uuid(); $storageKey=$id . '/' . $fileId;
        $dir=$c['storage'].'/uploads/'.$id;
        if (!is_dir($dir) && !mkdir($dir,0700,true)) { $status='incomplete'; continue; }
        $target=$c['storage'].'/uploads/'.$storageKey;
        try {
            if (!move_uploaded_file($file['path'],$target)) throw new RuntimeException('Upload move failed.');
            chmod($target,0600);
            $s=$db->prepare('INSERT INTO attachments VALUES(?,?,?,?,?,?)'); $s->execute([$fileId,$id,$storageKey,$file['name'],$file['type'],$file['size']]);
        } catch(Throwable) { $status='incomplete'; if (is_file($target)) unlink($target); }
    }
    $db->prepare('UPDATE enquiries SET upload_status=? WHERE id=?')->execute([$status,$id]);
    return ['receipt'=>$id,'duplicate'=>false,'uploadStatus'=>$status];
}
function signed_link(array $c,string $id,int $now): string {
    $expires=$now+900; $signature=hash_hmac('sha256',$id.':'.$expires,$c['secret']);
    return $c['origin'].'/api/attachments/'.$id.'?expires='.$expires.'&signature='.$signature;
}
function valid_link(array $c,string $id,array $query,int $now): bool {
    $expires=filter_var($query['expires']??'',FILTER_VALIDATE_INT);
    return (bool)preg_match('/^[a-f0-9-]{36}$/i',$id) && $expires!==false && $expires>$now && $expires<=$now+900
        && hash_equals(hash_hmac('sha256',$id.':'.$expires,$c['secret']),$query['signature']??'');
}
function notify(PDO $db,array $c,string $id,?callable $transport=null): bool {
    $now=gmdate('c');
    $s=$db->prepare('SELECT e.*, n.state,n.attempts FROM enquiries e JOIN notification_outbox n ON e.id=n.enquiry_id WHERE e.id=?'); $s->execute([$id]); $row=$s->fetch(PDO::FETCH_ASSOC);
    if (!$row || $row['state']!=='pending') return false;
    if ($row['upload_status']==='pending') {
        if (time()-strtotime($row['created_at'])<300) return false;
        $row['upload_status']='incomplete'; $db->prepare("UPDATE enquiries SET upload_status='incomplete' WHERE id=?")->execute([$id]);
    }
    $s=$db->prepare("UPDATE notification_outbox SET state='sending',next_attempt_at=? WHERE enquiry_id=? AND state='pending' RETURNING enquiry_id"); $s->execute([gmdate('c',time()+300),$id]); if (!$s->fetchColumn()) return false;
    $text='Receipt: '.$id."\n";
    foreach(['name','phone','email','suburb','service','timing','upload_status','brief'] as $field) $text.=ucfirst($field).': '.$row[$field]."\n";
    $s=$db->prepare('SELECT id,original_name FROM attachments WHERE enquiry_id=?'); $s->execute([$id]);
    foreach($s->fetchAll(PDO::FETCH_ASSOC) as $file) $text.=$file['original_name'].': '.signed_link($c,$file['id'],time())."\n";
    $headers=['From'=>$c['from_email'],'Reply-To'=>$row['email'],'Content-Type'=>'text/plain; charset=UTF-8'];
    try {
        // mail() acceptance is local mail-system handoff, not mailbox delivery.
        $ok=$transport ? $transport($c['notification_email'],'Regardin project enquiry — '.$row['service'],$text,$headers) : mail($c['notification_email'],'Regardin project enquiry — '.$row['service'],$text,$headers);
        if (!$ok) throw new RuntimeException('Mail handoff failed.');
        $db->prepare("UPDATE notification_outbox SET state='sent',sent_at=?,attempts=attempts+1,last_error=NULL WHERE enquiry_id=?")->execute([$now,$id]); return true;
    } catch(Throwable) {
        $next=gmdate('c',time()+min(86400,60*(2**min((int)$row['attempts'],10))));
        $db->prepare("UPDATE notification_outbox SET state='pending',attempts=attempts+1,next_attempt_at=?,last_error='Mail handoff failed; retry queued' WHERE enquiry_id=?")->execute([$next,$id]); return false;
    }
}
