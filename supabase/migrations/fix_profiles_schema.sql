-- Fix profiles table schema to support users who pay before signup
-- This allows webhook to create profiles without user ID first

-- Make id column nullable temporarily to allow payment-first users
ALTER TABLE profiles ALTER COLUMN id DROP NOT NULL;

-- Add constraint to ensure either id exists OR email exists
ALTER TABLE profiles ADD CONSTRAINT profiles_id_or_email_check 
    CHECK (id IS NOT NULL OR email IS NOT NULL);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Update existing profiles to ensure data integrity
-- (No action needed if all profiles already have IDs)

-- Add comment for documentation
COMMENT ON COLUMN profiles.id IS 'User ID from auth.users - can be NULL for payment-first users until they signup';
COMMENT ON COLUMN profiles.email IS 'User email - used to link payment to account';
COMMENT ON COLUMN profiles.status IS 'Account status: free or premium';
