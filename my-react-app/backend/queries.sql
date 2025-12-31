-- =============================================
-- ACCOUNTING APPLICATION - SQL QUERIES
-- Database: PostgreSQL
-- Created: December 2025
-- =============================================

-- =============================================
-- SECTION 1: DATABASE SETUP
-- =============================================

-- Create database (run this separately in pgAdmin if needed)
-- CREATE DATABASE accounting_db;

-- =============================================
-- SECTION 2: TABLE CREATION
-- =============================================

-- ---------------------------------------------
-- Table: clients
-- Description: Stores client/party information
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    clientname VARCHAR(255) NOT NULL,
    shopname VARCHAR(255),
    mobilenumber VARCHAR(20),
    city VARCHAR(100),
    openingbalance NUMERIC(10, 2) DEFAULT 0.00,
    createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------
-- Table: transactions
-- Description: Stores all financial transactions
-- Account Types: Cash, Bank, Net
-- Note: particulars is nullable (optional description)
-- Net Account: Debit-only transactions (credit must be 0)
-- ---------------------------------------------
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

-- ---------------------------------------------
-- Indexes for better query performance
-- ---------------------------------------------
CREATE INDEX IF NOT EXISTS idx_transactions_clientid ON transactions(clientid);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_clients_clientname ON clients(clientname);


-- =============================================
-- SECTION 3: CLIENT QUERIES
-- =============================================

-- ---------------------------------------------
-- Get all clients (ordered by newest first)
-- ---------------------------------------------
SELECT * FROM clients ORDER BY createdat DESC;

-- ---------------------------------------------
-- Get client by ID
-- ---------------------------------------------
SELECT * FROM clients WHERE id = $1;

-- ---------------------------------------------
-- Search clients by name
-- ---------------------------------------------
SELECT * FROM clients 
WHERE clientname ILIKE '%' || $1 || '%' 
   OR shopname ILIKE '%' || $1 || '%'
ORDER BY clientname;

-- ---------------------------------------------
-- Create new client
-- ---------------------------------------------
INSERT INTO clients (clientname, shopname, mobilenumber, city, openingbalance, createdat)
VALUES ($1, $2, $3, $4, $5, NOW())
RETURNING *;

-- ---------------------------------------------
-- Update client
-- ---------------------------------------------
UPDATE clients 
SET clientname = $1, 
    shopname = $2, 
    mobilenumber = $3, 
    city = $4, 
    openingbalance = $5
WHERE id = $6
RETURNING *;

-- ---------------------------------------------
-- Delete client
-- ---------------------------------------------
DELETE FROM clients WHERE id = $1;

-- ---------------------------------------------
-- Get client count
-- ---------------------------------------------
SELECT COUNT(*) as total_clients FROM clients;

-- ---------------------------------------------
-- Get clients by city
-- ---------------------------------------------
SELECT * FROM clients WHERE city = $1 ORDER BY clientname;


-- =============================================
-- SECTION 4: TRANSACTION QUERIES
-- =============================================

-- ---------------------------------------------
-- Get all transactions with client name
-- ---------------------------------------------
SELECT t.*, c.clientname, c.shopname
FROM transactions t
LEFT JOIN clients c ON t.clientid = c.id
ORDER BY t.date DESC, t.id DESC;

-- ---------------------------------------------
-- Get transaction by ID
-- ---------------------------------------------
SELECT t.*, c.clientname, c.shopname
FROM transactions t
LEFT JOIN clients c ON t.clientid = c.id
WHERE t.id = $1;

-- ---------------------------------------------
-- Get transactions by client ID
-- ---------------------------------------------
SELECT * FROM transactions 
WHERE clientid = $1 
ORDER BY date ASC, id ASC;

-- ---------------------------------------------
-- Create new transaction
-- ---------------------------------------------
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance, createdat)
VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
RETURNING *;

-- ---------------------------------------------
-- Update transaction
-- ---------------------------------------------
UPDATE transactions 
SET date = $1, 
    account = $2, 
    particulars = $3, 
    dr = $4, 
    cr = $5, 
    balance = $6
WHERE id = $7
RETURNING *;

-- ---------------------------------------------
-- Delete transaction
-- ---------------------------------------------
DELETE FROM transactions WHERE id = $1;

-- ---------------------------------------------
-- Delete all transactions for a client
-- ---------------------------------------------
DELETE FROM transactions WHERE clientid = $1;


-- =============================================
-- SECTION 5: LEDGER & REPORT QUERIES
-- =============================================

-- ---------------------------------------------
-- Get ledger statement for a client (date range)
-- ---------------------------------------------
SELECT * FROM transactions 
WHERE clientid = $1 
  AND date BETWEEN $2 AND $3
ORDER BY date ASC, id ASC;

-- ---------------------------------------------
-- Get ledger with running balance for a client
-- ---------------------------------------------
SELECT 
    t.id,
    t.date,
    t.account,
    t.particulars,
    t.dr,
    t.cr,
    SUM(t.dr - t.cr) OVER (ORDER BY t.date, t.id) + c.openingbalance AS running_balance
FROM transactions t
JOIN clients c ON t.clientid = c.id
WHERE t.clientid = $1
ORDER BY t.date ASC, t.id ASC;

-- ---------------------------------------------
-- Get ledger with running balance (with date range)
-- ---------------------------------------------
SELECT 
    t.id,
    t.date,
    t.account,
    t.particulars,
    t.dr,
    t.cr,
    SUM(t.dr - t.cr) OVER (ORDER BY t.date, t.id) + c.openingbalance AS running_balance
FROM transactions t
JOIN clients c ON t.clientid = c.id
WHERE t.clientid = $1 
  AND t.date BETWEEN $2 AND $3
ORDER BY t.date ASC, t.id ASC;

-- ---------------------------------------------
-- Get client balance (current)
-- ---------------------------------------------
SELECT 
    c.id,
    c.clientname,
    c.shopname,
    c.openingbalance,
    COALESCE(SUM(t.dr), 0) AS total_debit,
    COALESCE(SUM(t.cr), 0) AS total_credit,
    c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) AS current_balance
FROM clients c
LEFT JOIN transactions t ON c.id = t.clientid
WHERE c.id = $1
GROUP BY c.id, c.clientname, c.shopname, c.openingbalance;

-- ---------------------------------------------
-- Get all clients with their current balances
-- ---------------------------------------------
SELECT 
    c.id,
    c.clientname,
    c.shopname,
    c.city,
    c.mobilenumber,
    c.openingbalance,
    COALESCE(SUM(t.dr), 0) AS total_debit,
    COALESCE(SUM(t.cr), 0) AS total_credit,
    c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) AS current_balance
FROM clients c
LEFT JOIN transactions t ON c.id = t.clientid
GROUP BY c.id, c.clientname, c.shopname, c.city, c.mobilenumber, c.openingbalance
ORDER BY c.clientname;

-- ---------------------------------------------
-- Get clients with outstanding balance (debtors)
-- ---------------------------------------------
SELECT 
    c.id,
    c.clientname,
    c.shopname,
    c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) AS current_balance
FROM clients c
LEFT JOIN transactions t ON c.id = t.clientid
GROUP BY c.id, c.clientname, c.shopname, c.openingbalance
HAVING c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) > 0
ORDER BY current_balance DESC;

-- ---------------------------------------------
-- Get clients with credit balance (creditors)
-- ---------------------------------------------
SELECT 
    c.id,
    c.clientname,
    c.shopname,
    c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) AS current_balance
FROM clients c
LEFT JOIN transactions t ON c.id = t.clientid
GROUP BY c.id, c.clientname, c.shopname, c.openingbalance
HAVING c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) < 0
ORDER BY current_balance ASC;


-- =============================================
-- SECTION 6: DASHBOARD & ANALYTICS QUERIES
-- =============================================

-- ---------------------------------------------
-- Get total receivables (sum of all positive balances)
-- ---------------------------------------------
SELECT COALESCE(SUM(balance), 0) AS total_receivables
FROM (
    SELECT c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) AS balance
    FROM clients c
    LEFT JOIN transactions t ON c.id = t.clientid
    GROUP BY c.id, c.openingbalance
    HAVING c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) > 0
) AS debtors;

-- ---------------------------------------------
-- Get total payables (sum of all negative balances)
-- ---------------------------------------------
SELECT COALESCE(ABS(SUM(balance)), 0) AS total_payables
FROM (
    SELECT c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) AS balance
    FROM clients c
    LEFT JOIN transactions t ON c.id = t.clientid
    GROUP BY c.id, c.openingbalance
    HAVING c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) < 0
) AS creditors;

-- ---------------------------------------------
-- Get transactions summary by date range
-- ---------------------------------------------
SELECT 
    COUNT(*) AS total_transactions,
    COALESCE(SUM(dr), 0) AS total_debit,
    COALESCE(SUM(cr), 0) AS total_credit
FROM transactions
WHERE date BETWEEN $1 AND $2;

-- ---------------------------------------------
-- Get transactions summary by account type
-- ---------------------------------------------
SELECT 
    account,
    COUNT(*) AS transaction_count,
    COALESCE(SUM(dr), 0) AS total_debit,
    COALESCE(SUM(cr), 0) AS total_credit
FROM transactions
GROUP BY account
ORDER BY transaction_count DESC;

-- ---------------------------------------------
-- Get recent transactions (last 10)
-- ---------------------------------------------
SELECT t.*, c.clientname, c.shopname
FROM transactions t
LEFT JOIN clients c ON t.clientid = c.id
ORDER BY t.createdat DESC
LIMIT 10;

-- ---------------------------------------------
-- Get daily transaction summary
-- ---------------------------------------------
SELECT 
    date,
    COUNT(*) AS transaction_count,
    COALESCE(SUM(dr), 0) AS total_debit,
    COALESCE(SUM(cr), 0) AS total_credit
FROM transactions
WHERE date BETWEEN $1 AND $2
GROUP BY date
ORDER BY date DESC;

-- ---------------------------------------------
-- Get monthly transaction summary
-- ---------------------------------------------
SELECT 
    DATE_TRUNC('month', date) AS month,
    COUNT(*) AS transaction_count,
    COALESCE(SUM(dr), 0) AS total_debit,
    COALESCE(SUM(cr), 0) AS total_credit
FROM transactions
WHERE date BETWEEN $1 AND $2
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;


-- =============================================
-- SECTION 7: OPENING BALANCE TRANSACTION
-- =============================================

-- ---------------------------------------------
-- Create opening balance transaction for new client
-- (Run this after creating a client with opening balance)
-- ---------------------------------------------
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance, createdat)
SELECT 
    CURRENT_DATE,
    id,
    'Cash',
    'Opening Balance',
    openingbalance,
    0,
    openingbalance,
    NOW()
FROM clients
WHERE id = $1 AND openingbalance > 0;

-- For credit opening balance
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance, createdat)
SELECT 
    CURRENT_DATE,
    id,
    'Cash',
    'Opening Balance',
    0,
    ABS(openingbalance),
    openingbalance,
    NOW()
FROM clients
WHERE id = $1 AND openingbalance < 0;


-- =============================================
-- SECTION 8: UTILITY QUERIES
-- =============================================

-- ---------------------------------------------
-- Recalculate balance for all transactions of a client
-- (Useful for fixing balance inconsistencies)
-- ---------------------------------------------
WITH running_totals AS (
    SELECT 
        t.id,
        c.openingbalance + SUM(t.dr - t.cr) OVER (
            PARTITION BY t.clientid 
            ORDER BY t.date, t.id
        ) AS calculated_balance
    FROM transactions t
    JOIN clients c ON t.clientid = c.id
    WHERE t.clientid = $1
)
UPDATE transactions t
SET balance = rt.calculated_balance
FROM running_totals rt
WHERE t.id = rt.id;

-- ---------------------------------------------
-- Check for duplicate transactions
-- ---------------------------------------------
SELECT date, clientid, account, particulars, dr, cr, COUNT(*)
FROM transactions
GROUP BY date, clientid, account, particulars, dr, cr
HAVING COUNT(*) > 1;

-- ---------------------------------------------
-- Get transaction count per client
-- ---------------------------------------------
SELECT 
    c.id,
    c.clientname,
    COUNT(t.id) AS transaction_count
FROM clients c
LEFT JOIN transactions t ON c.id = t.clientid
GROUP BY c.id, c.clientname
ORDER BY transaction_count DESC;


-- =============================================
-- SECTION 9: SAMPLE DATA (FOR TESTING)
-- =============================================

-- Uncomment and run these to insert sample data

/*
-- Insert sample clients
INSERT INTO clients (clientname, shopname, mobilenumber, city, openingbalance) VALUES
('ABC Trading Co.', 'ABC Shop', '9876543210', 'Mumbai', 5000.00),
('XYZ Imports Ltd.', 'XYZ Shop', '9876543211', 'Delhi', 0.00),
('PQR Enterprises', 'PQR Store', '9876543212', 'Bangalore', 2500.00);

-- Insert sample transactions
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance) VALUES
('2024-12-18', 1, 'Cash', 'Opening Balance', 5000.00, 0.00, 5000.00),
('2024-12-18', 1, 'Bank', 'Deposit', 0.00, 2000.00, 3000.00),
('2024-12-19', 1, 'Cash', 'Sales', 1500.00, 0.00, 4500.00),
('2024-12-20', 2, 'Cash', 'Purchase', 0.00, 3000.00, -3000.00);
*/


-- =============================================
-- END OF QUERIES FILE
-- =============================================
