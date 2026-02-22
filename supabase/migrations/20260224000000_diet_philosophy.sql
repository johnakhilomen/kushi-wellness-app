-- ============================================================
-- Add diet philosophy column to profiles
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS diet_philosophy TEXT NOT NULL DEFAULT 'macrobiotic'
  CHECK (diet_philosophy IN ('macrobiotic', 'ayurvedic', 'sattvic', 'tcm', 'wfpb', 'alkaline'));
