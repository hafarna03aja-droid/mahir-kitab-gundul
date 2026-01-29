-- Add monthly usage column to profiles table
-- Migration: 20260129_add_monthly_usage_column.sql

-- Add monthly usage counter
ALTER TABLE profiles 
    ADD COLUMN IF NOT EXISTS monthly_usage_count INTEGER DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN profiles.monthly_usage_count IS 'Monthly API call counter, resets each month';
