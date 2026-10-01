CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  payload_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  suburb TEXT NOT NULL,
  service TEXT NOT NULL,
  brief TEXT NOT NULL,
  timing TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  upload_status TEXT NOT NULL DEFAULT 'none'
);
CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY,
  enquiry_id TEXT NOT NULL REFERENCES enquiries(id),
  storage_key TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS notification_outbox (
  enquiry_id TEXT PRIMARY KEY REFERENCES enquiries(id),
  state TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT NOT NULL,
  sent_at TEXT,
  last_error TEXT
);
CREATE TABLE IF NOT EXISTS rate_limits (
  identity_hash TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS notification_due ON notification_outbox(state, next_attempt_at);
CREATE INDEX IF NOT EXISTS enquiry_created ON enquiries(created_at);
