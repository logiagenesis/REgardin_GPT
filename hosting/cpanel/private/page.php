<?php
declare(strict_types=1);
require dirname(__DIR__).'/public_html/regardin-loader.php';
session_start_private(); $c=configuration();
header('Cache-Control: private, no-store');
$html=file_get_contents(__DIR__.'/'.$page.'.html');
if ($page==='contact') {
    $_SESSION['form_key'] ??= uuid();
    $html=str_replace('name="photos"','name="photos[]"',$html);
    $html=str_replace('name="idempotencyKey" value=""','name="idempotencyKey" value="'.escape($_SESSION['form_key']).'"',$html);
    $html=str_replace('<div class="honeypot"','<input type="hidden" name="csrf" value="'.escape($_SESSION['csrf']).'"><div class="honeypot"',$html);
    if (ready($c)) {
        $html=str_replace('id="submit-enquiry" class="button" hidden','id="submit-enquiry" class="button"',$html);
        $html=str_replace('id="upload-field" hidden','id="upload-field"',$html);
        $html=preg_replace('~<div class="form-notice".*?</div>~s','<div class="form-notice" role="note"><strong>Send your project enquiry.</strong><p>Your enquiry is saved before a receipt is shown. You can submit without JavaScript.</p></div>',$html,1);
        $html=preg_replace('~<noscript>.*?</noscript>~s','<noscript><p>The form can be submitted without JavaScript.</p></noscript>',$html,1);
    }
    if (isset($_SESSION['form_error'])) {
        $html=str_replace('<p id="form-status" role="status" aria-live="polite"></p>','<p id="form-status" role="alert">'.escape($_SESSION['form_error']).'</p>',$html);
        foreach($_SESSION['form_values']??[] as $name=>$value) {
            if ($name==='brief') $html=preg_replace_callback('~(<textarea[^>]*name="brief"[^>]*>).*?(</textarea>)~s',fn($m)=>$m[1].escape($value).$m[2],$html);
            elseif ($name==='service') $html=preg_replace_callback('~<option value="'.preg_quote(escape($value),'~').'">~',fn($m)=>substr($m[0],0,-1).' selected>',$html);
            else $html=preg_replace_callback('~<input[^>]*name="'.preg_quote($name,'~').'"[^>]*>~',fn($m)=>preg_replace('~\svalue="[^"]*"~','',substr($m[0],0,-1)).' value="'.escape($value).'">',$html);
        }
        unset($_SESSION['form_error'],$_SESSION['form_values']);
    }
} elseif ($page==='thank-you' && isset($_SESSION['receipt'])) {
    $receipt=$_SESSION['receipt']; unset($_SESSION['receipt']);
    $text='<h2>Your enquiry has been saved.</h2><p>Receipt: '.escape($receipt['receipt']).'. This confirms secure storage, not a booking or mailbox delivery.</p>';
    if ($receipt['uploadStatus']==='incomplete') $text.='<p>One or more attachments could not be stored. Contact Regardin to arrange another way to share them.</p>';
    $html=preg_replace_callback('~(<[^>]+id="receipt-status"[^>]*>).*?(</div>)~s',fn($m)=>$m[1].$text.$m[2],$html,1);
}
echo $html;
