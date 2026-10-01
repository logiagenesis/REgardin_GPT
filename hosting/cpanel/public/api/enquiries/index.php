<?php
declare(strict_types=1);
require dirname(__DIR__,2).'/regardin-loader.php';
header('Cache-Control: no-store'); header('X-Content-Type-Options: nosniff');
$c=configuration(); session_start_private();
$json=str_contains($_SERVER['HTTP_ACCEPT']??'','application/json');
if ($_SERVER['REQUEST_METHOD']==='GET') { header('Content-Type: application/json'); echo json_encode(['enabled'=>ready($c),'csrf'=>$_SESSION['csrf'],'verification'=>'session']); exit; }
if ($_SERVER['REQUEST_METHOD']!=='POST') { http_response_code(405); header('Allow: GET, POST'); exit; }
try {
    if (!ready($c)) { http_response_code(503); throw new RuntimeException('Online enquiries are not connected. Please call or email Regardin.'); }
    if ((int)($_SERVER['CONTENT_LENGTH']??0)>42*1024*1024) { http_response_code(413); throw new InvalidArgumentException('The enquiry is too large.'); }
    $origin=$_SERVER['HTTP_ORIGIN']??'';
    if ($origin!=='' && $origin!==$c['origin']) { http_response_code(403); throw new InvalidArgumentException('Invalid request origin.'); }
    if (!is_string($_POST['csrf']??null) || !hash_equals($_SESSION['csrf'],$_POST['csrf']) || !empty($_POST['website'])) { http_response_code(403); throw new InvalidArgumentException('Verification failed. Reload the form.'); }
    $data=fields($_POST); $files=files($_FILES['photos']??[]); $key=$_POST['idempotencyKey']??'';
    if (!is_string($key) || !preg_match('/^[\da-f-]{36}$/i',$key)) throw new InvalidArgumentException('Please reload the form before sending.');
    $db=database($c);
    if (!take_limit($db,hash_hmac('sha256',$_SERVER['REMOTE_ADDR']??'unknown',$c['secret']),time())) { http_response_code(429); throw new InvalidArgumentException('Too many enquiries. Please wait before trying again.'); }
    $result=store($db,$c,$data,$key,$files);
    $_SESSION['receipt']=$result; $_SESSION['form_key']=uuid(); unset($_SESSION['form_error'],$_SESSION['form_values']);
    // Keep the PHP session lock through durable acceptance; duplicate posts use idempotency.
    session_write_close();
    if (!$result['duplicate']) {
        try { notify($db,$c,$result['receipt']); } catch (Throwable) { /* Durable receipt is independent of notification; operator reviews the outbox. */ }
    }
    if ($json) { header('Content-Type: application/json'); echo json_encode($result); }
    else { header('Location: /thank-you/',true,303); }
} catch(Throwable $e) {
    if (http_response_code()<400) http_response_code($e instanceof InvalidArgumentException ? 400 : 500);
    $message=$e instanceof InvalidArgumentException || http_response_code()===503 ? $e->getMessage() : 'The enquiry could not be saved. Please try again or call Regardin.';
    if ($json) { header('Content-Type: application/json'); echo json_encode(['error'=>$message]); }
    else {
        $_SESSION['form_error']=$message;
        $_SESSION['form_values']=array_filter($_POST,fn($v,$k)=>in_array($k,['name','phone','email','suburb','service','brief','timing'],true)&&is_string($v),ARRAY_FILTER_USE_BOTH);
        header('Location: /contact/',true,303);
    }
}
