-- Improve profiles table with additional constraints and features
-- Migration: 20251205120100_improve_profiles_table.sql

-- Add check constraint for status
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_status_check 
    CHECK (status IN ('free', 'premium'));

-- Add subscription expiry column for future subscription model
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
    subscription_expires_at TIMESTAMPTZ;

-- Ensure updated_at exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
    updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update trigger for updated_at (reuse function from orders migration)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_status_email 
    ON profiles(status, email);

-- Update comments
COMMENT ON TABLE profiles IS 'User profiles with subscription status and payment info';
COMMENT ON COLUMN profiles.subscription_expires_at IS 'NULL = lifetime access, otherwise expiry timestamp';
COMMENT ON COLUMN profiles.status IS 'Subscription status: free or premium';
COMMENT ON COLUMN profiles.id IS 'User ID from auth.users - can be NULL for payment-first users';
