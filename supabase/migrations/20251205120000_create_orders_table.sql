-- Create orders table for Midtrans payment tracking
-- Migration: 20251205120000_create_orders_table.sql

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Keys
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    
    -- Midtrans Data
    order_id TEXT UNIQUE NOT NULL,
    snap_token TEXT,
    
    -- Payment Details
    gross_amount NUMERIC(10,2) NOT NULL,
    payment_type TEXT,
    transaction_status TEXT NOT NULL DEFAULT 'pending',
    fraud_status TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    expired_at TIMESTAMPTZ,
    
    -- Metadata
    midtrans_response JSONB,
    webhook_attempts INT DEFAULT 0,
    
    -- Constraints
    CONSTRAINT orders_amount_positive CHECK (gross_amount > 0),
    CONSTRAINT orders_status_valid CHECK (
        transaction_status IN (
            'pending', 'settlement', 'capture', 
            'deny', 'cancel', 'expire', 'failure'
        )
    )
);

-- Indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(transaction_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, transaction_status);

-- Trigger untuk update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE orders IS 'Payment orders from Midtrans with full audit trail';
COMMENT ON COLUMN orders.gross_amount IS 'Amount in IDR - use NUMERIC for financial precision';
COMMENT ON COLUMN orders.midtrans_response IS 'Full webhook payload for debugging and audit';
COMMENT ON COLUMN orders.webhook_attempts IS 'Counter to prevent webhook spam attacks';
COMMENT ON COLUMN orders.user_id IS 'Nullable - user might pay before signup';
