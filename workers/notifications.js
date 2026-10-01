import { notifyPending } from '../functions/lib/enquiries.js';
export default {
  async scheduled(_event, env, context) {
    const now = new Date().toISOString();
    // Recover stale claims after an interrupted invocation; provider idempotency prevents duplicate mail.
    await env.DB.prepare(
      "UPDATE notification_outbox SET state = 'pending' WHERE state = 'sending' AND next_attempt_at <= ?",
    )
      .bind(now)
      .run();
    const pending = await env.DB.prepare(
      "SELECT enquiry_id FROM notification_outbox WHERE state = 'pending' AND next_attempt_at <= ? ORDER BY next_attempt_at LIMIT 25",
    )
      .bind(now)
      .all();
    for (const row of pending.results) context.waitUntil(notifyPending(env, row.enquiry_id));
    await env.DB.prepare('DELETE FROM rate_limits WHERE window_start < ?')
      .bind(Date.now() - 86400000)
      .run();
  },
};
