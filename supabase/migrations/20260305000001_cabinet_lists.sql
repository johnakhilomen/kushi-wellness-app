-- ============================================================
-- Cabinet: AI-generated grocery lists by diet philosophy
-- ============================================================

CREATE TABLE cabinet_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  list_date DATE NOT NULL DEFAULT CURRENT_DATE,
  categories JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, list_date)
);

ALTER TABLE cabinet_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cabinet lists" ON cabinet_lists
  FOR ALL USING (auth.uid() = user_id);
