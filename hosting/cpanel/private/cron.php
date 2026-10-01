<?php
declare(strict_types=1);
require __DIR__.'/app.php';
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
$c=configuration();
if (!ready($c)) { fwrite(STDERR,"Enquiry service is not configured.\n"); exit(1); }
$db=database($c); $now=gmdate('c');
// Native mail has no provider idempotency key: interrupted handoffs need operator review.
$db->prepare("UPDATE notification_outbox SET state='review',last_error='Interrupted mail handoff; verify mail log before retry' WHERE state='sending' AND next_attempt_at<=?")->execute([$now]);
$s=$db->prepare("SELECT enquiry_id FROM notification_outbox WHERE state='pending' AND next_attempt_at<=? ORDER BY next_attempt_at LIMIT 25"); $s->execute([$now]);
foreach($s->fetchAll(PDO::FETCH_COLUMN) as $id) notify($db,$c,$id);
$db->prepare('DELETE FROM rate_limits WHERE window_start<?')->execute([time()-86400]);
