-- =============================================
-- UPDATE TRANSACTIONS TABLE SCHEMA
-- Add CHECK constraint for account types
-- and explicit NULL for particulars
-- =============================================

-- Drop the existing transactions table (and any dependent objects)
-- WARNING: This will delete all transaction data!
-- To preserve data, backup first or use ALTER TABLE instead

-- Option 1: Drop and recreate (DESTRUCTIVE - use only for testing/development)
DROP TABLE IF EXISTS transactions CASCADE;

-- Option 2 (SAFER - Recommended for production): Add constraint without dropping
-- ALTER TABLE transactions 
-- DROP CONSTRAINT IF EXISTS account_check,
-- ADD CONSTRAINT account_check CHECK (account IN ('Cash', 'Bank', 'Net'));

-- Recreate transactions table with updated schema
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    clientid INTEGER NOT NULL,
    account VARCHAR(50) NOT NULL CHECK (account IN ('Cash', 'Bank', 'Net', 'No NET', 'Goods')),
    particulars VARCHAR(255) NULL,
    dr NUMERIC(10, 2) DEFAULT 0.00,
    cr NUMERIC(10, 2) DEFAULT 0.00,
    balance NUMERIC(10, 2) DEFAULT 0.00,
    createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_client
        FOREIGN KEY (clientid)
        REFERENCES clients(id)
        ON DELETE CASCADE
);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_transactions_clientid ON transactions(clientid);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

-- Verify the constraint was created
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'transactions' AND constraint_type = 'CHECK';
