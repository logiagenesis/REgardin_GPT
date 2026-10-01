<?php
declare(strict_types=1);
require dirname(__DIR__).'/hosting/cpanel/private/app.php';
$path=sys_get_temp_dir().'/regardin-php-'.bin2hex(random_bytes(8)); mkdir($path,0700);
$c=['enabled'=>true,'origin'=>'https://synthetic.example','storage'=>$path,'secret'=>str_repeat('synthetic',8),'operator_token'=>str_repeat('operator',8),'from_email'=>'synthetic@example.com','notification_email'=>'recipient@example.com'];
$_SERVER['DOCUMENT_ROOT']=sys_get_temp_dir().'/unrelated-public';
function check(bool $result,string $message): void { if (!$result) throw new RuntimeException($message); }
try {
    check(ready($c),'Valid configuration must enable service');
    check(!ready([...$c,'secret'=>'short']),'Short secrets must fail closed');
    $_SERVER['DOCUMENT_ROOT']=$path; check(!ready($c),'Public storage must be rejected'); $_SERVER['DOCUMENT_ROOT']=sys_get_temp_dir().'/unrelated-public';
    $data=fields(['name'=>'Synthetic Test','phone'=>'+27000000000','email'=>'test@example.com','suburb'=>'Test location','service'=>'painting','brief'=>'Synthetic project details for a PHP test only.','timing'=>'']);
    try { fields([...$data,'email'=>"test@example.com\r\nBcc:other@example.com"]); throw new RuntimeException('Header injection accepted'); } catch(InvalidArgumentException) {}
    try { fields([...$data,'service'=>'invented']); throw new RuntimeException('Invalid service accepted'); } catch(InvalidArgumentException) {}
    $db=database($c); $key=uuid(); $a=store($db,$c,$data,$key,[]); $b=store($db,$c,$data,$key,[]);
    check($a['receipt']===$b['receipt'] && $b['duplicate'],'Duplicate enquiry must return prior receipt');
    check((int)$db->query('SELECT count(*) FROM enquiries')->fetchColumn()===1,'Enquiry stored once');
    check((int)$db->query('SELECT count(*) FROM notification_outbox')->fetchColumn()===1,'Retry outbox stored with enquiry');
    try { store($db,$c,[...$data,'brief'=>'Different synthetic brief details.'],$key,[]); throw new RuntimeException('Conflicting payload accepted'); } catch(InvalidArgumentException) {}
    for($i=0;$i<5;$i++) check(take_limit($db,'synthetic-ip',1000),'First five requests allowed');
    check(!take_limit($db,'synthetic-ip',1000),'Sixth request rejected'); check(take_limit($db,'synthetic-ip',1600),'New window allowed');
    $id=uuid(); parse_str(parse_url(signed_link($c,$id,1000),PHP_URL_QUERY),$query);
    check(valid_link($c,$id,$query,1001),'Valid private link'); check(!valid_link($c,$id,$query,1900),'Expired link rejected');
    check(!valid_link($c,uuid(),$query,1001),'Tampered identifier rejected');
    check(!notify($db,$c,$a['receipt'],fn()=>false),'Failed mail queues retry');
    check($db->query('SELECT state FROM notification_outbox')->fetchColumn()==='pending','Retry remains pending');
    $calls=0; $transport=function($to,$subject,$body,$headers)use(&$calls){$calls++; check($headers['Reply-To']==='test@example.com','Reply-To customer');check(str_contains($body,'Synthetic project'),'Message body');return true;};
    check(notify($db,$c,$a['receipt'],$transport),'Successful handoff marked sent'); check(!notify($db,$c,$a['receipt'],$transport),'Sent mail not handed off twice'); check($calls===1,'One successful handoff');
    echo "PASS PHP configuration, private storage, validation, SQL idempotency, limits, expiring links and retry handoff.\n";
} finally {
    $db=null; foreach(glob($path.'/*') as $p) if(is_file($p)) unlink($p); rmdir($path);
}
