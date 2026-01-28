-- Add rate limiting columns to profiles table
-- Migration: 20260128_add_rate_limiting_columns.sql

-- Add daily usage counter
ALTER TABLE profiles 
    ADD COLUMN IF NOT EXISTS daily_usage_count INTEGER DEFAULT 0;

-- Add last usage date tracker
ALTER TABLE profiles 
    ADD COLUMN IF NOT EXISTS last_usage_date DATE DEFAULT CURRENT_DATE;

-- Add comments for documentation
COMMENT ON COLUMN profiles.daily_usage_count IS 'Daily API call counter, resets each day';
COMMENT ON COLUMN profiles.last_usage_date IS 'Last date the usage counter was updated';

-- Create index for efficient lookups on active users
CREATE INDEX IF NOT EXISTS idx_profiles_last_usage_date 
    ON profiles(last_usage_date) 
    WHERE daily_usage_count > 0;
