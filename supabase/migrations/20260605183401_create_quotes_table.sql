
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  message_ts TEXT NOT NULL DEFAULT 'pending',
  requested_by TEXT NOT NULL,
  leander_done BOOLEAN NOT NULL DEFAULT FALSE,
  james_done BOOLEAN NOT NULL DEFAULT FALSE,
  kunikka_done BOOLEAN NOT NULL DEFAULT FALSE,
  lore_done BOOLEAN NOT NULL DEFAULT FALSE,
  carrier_done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_quotes" ON quotes FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_quotes" ON quotes FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_quotes" ON quotes FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_quotes" ON quotes FOR DELETE
  TO authenticated USING (true);
