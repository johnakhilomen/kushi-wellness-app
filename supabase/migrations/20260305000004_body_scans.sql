-- ============================================================
-- Body Scan: daily body awareness check-in
-- ============================================================

CREATE TABLE body_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  zones JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, scan_date)
);

ALTER TABLE body_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own body scans" ON body_scans
  FOR ALL USING (auth.uid() = user_id);
