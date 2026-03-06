-- ============================================================
-- Hydration: daily water intake tracking
-- ============================================================

CREATE TABLE hydration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  glasses INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, log_date)
);

ALTER TABLE hydration_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own hydration logs" ON hydration_logs
  FOR ALL USING (auth.uid() = user_id);
