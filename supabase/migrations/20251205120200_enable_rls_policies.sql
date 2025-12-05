-- Enable Row Level Security and create policies
-- Migration: 20251205120200_enable_rls_policies.sql

-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ========================================
-- PROFILES POLICIES
-- ========================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role full access to profiles" ON profiles;
DROP POLICY IF EXISTS "Webhook can upsert profiles by email" ON profiles;

-- 1. Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id OR email = auth.jwt()->>'email');

-- 2. Users can update their own profile (except status!)
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        status = (SELECT status FROM profiles WHERE id = auth.uid())
    );

-- 3. Service role can do anything (for webhook and system operations)
CREATE POLICY "Service role full access to profiles"
    ON profiles FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- 4. Allow anonymous insert for payment-first users
CREATE POLICY "Allow profile creation for payment"
    ON profiles FOR INSERT
    WITH CHECK (true);

-- ========================================
-- ORDERS POLICIES
-- ========================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Only service role can update orders" ON orders;
DROP POLICY IF EXISTS "Service role full access to orders" ON orders;

-- 1. Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (
        auth.uid() = user_id OR
        email = auth.jwt()->>'email'
    );

-- 2. Allow creating orders (for payment initiation)
CREATE POLICY "Users can create orders"
    ON orders FOR INSERT
    WITH CHECK (true);

-- 3. ONLY service role can update orders (CRITICAL for security!)
CREATE POLICY "Only service role can update orders"
    ON orders FOR UPDATE
    USING (auth.jwt()->>'role' = 'service_role');

-- 4. Service role full access
CREATE POLICY "Service role full access to orders"
    ON orders FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Add policy comments
COMMENT ON POLICY "Only service role can update orders" ON orders IS 
    'CRITICAL: Prevent users from manipulating payment status! Only webhook with service_role can update.';

COMMENT ON POLICY "Users can update own profile" ON profiles IS 
    'Users cannot change their own subscription status - only webhook can do this';
