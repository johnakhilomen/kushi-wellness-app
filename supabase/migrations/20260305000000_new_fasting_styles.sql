-- ============================================================
-- Expand fasting_style to support 18:6, 20:4, and OMAD (23:1)
-- ============================================================

-- Drop the existing check constraint and add an expanded one
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_fasting_style_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_fasting_style_check
  CHECK (fasting_style IN ('12:12', '14:10', '16:8', '18:6', '20:4', '23:1'));
