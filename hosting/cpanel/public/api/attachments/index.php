<?php
declare(strict_types=1);
require dirname(__DIR__,2).'/regardin-loader.php';
$c=configuration(); header('Cache-Control: no-store'); header('X-Content-Type-Options: nosniff');
if (!ready($c)) { http_response_code(503); exit; }
$id=$_GET['id']??'';
if ($_SERVER['REQUEST_METHOD']!=='GET' || !valid_link($c,$id,$_GET,time())) { http_response_code(403); exit; }
$db=database($c); $s=$db->prepare('SELECT * FROM attachments WHERE id=?'); $s->execute([$id]); $file=$s->fetch(PDO::FETCH_ASSOC);
$path=$file ? $c['storage'].'/uploads/'.$file['storage_key'] : '';
if (!$file || !is_file($path)) { http_response_code(404); exit; }
header('Content-Type: application/octet-stream'); header('Content-Security-Policy: sandbox');
header("Content-Disposition: attachment; filename*=UTF-8''".rawurlencode($file['original_name']));
header('Content-Length: '.filesize($path)); readfile($path);
