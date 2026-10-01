<?php
declare(strict_types=1);
require dirname(__DIR__,2).'/regardin-loader.php';
$c=configuration(); header('Cache-Control: no-store'); header('Content-Type: application/json');
$token=preg_replace('/^Bearer /','',$_SERVER['HTTP_AUTHORIZATION']??'');
if (!ready($c) || $_SERVER['REQUEST_METHOD']!=='POST' || !hash_equals($c['operator_token'],$token)) { http_response_code(403); exit; }
$body=json_decode(file_get_contents('php://input'),true); $id=$body['id']??'';
if (!is_string($id) || !preg_match('/^[\da-f-]{36}$/i',$id)) { http_response_code(400); exit; }
$s=database($c)->prepare('SELECT id FROM attachments WHERE id=?'); $s->execute([$id]);
if (!$s->fetchColumn()) { http_response_code(404); exit; }
echo json_encode(['url'=>signed_link($c,$id,time())]);
