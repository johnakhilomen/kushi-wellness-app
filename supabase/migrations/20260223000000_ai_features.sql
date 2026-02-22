-- ============================================================
-- AI Features: meal plans, daily rituals, insights
-- ============================================================

-- Stores LLM-generated daily meal plans
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meals JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, plan_date)
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own meal plans" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);

-- Stores LLM-generated daily rituals
CREATE TABLE daily_rituals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ritual_date DATE NOT NULL DEFAULT CURRENT_DATE,
  rituals JSONB NOT NULL DEFAULT '[]',
  quote TEXT,
  quote_author TEXT,
  evening_practice JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, ritual_date)
);

ALTER TABLE daily_rituals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own daily rituals" ON daily_rituals
  FOR ALL USING (auth.uid() = user_id);

-- Stores post-fast LLM insights
CREATE TABLE fasting_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fasting_session_id UUID REFERENCES fasting_sessions(id) ON DELETE CASCADE,
  duration_minutes INT,
  insight TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE fasting_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own fasting insights" ON fasting_insights
  FOR ALL USING (auth.uid() = user_id);

-- Stores gut harmony score explanation
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gut_harmony_explanation TEXT;
