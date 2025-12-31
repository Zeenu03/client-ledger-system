-- =============================================
-- ACCOUNTING APPLICATION - DATABASE SCHEMA
-- Database: PostgreSQL
-- Created: December 2025
-- Matches actual database structure exactly
-- =============================================

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- =============================================
-- Table: clients
-- Columns: 7
-- Primary Key: clients_pkey (id)
-- =============================================
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    clientname VARCHAR(255) NOT NULL,
    shopname VARCHAR(255),
    mobilenumber VARCHAR(20),
    city VARCHAR(100),
    openingbalance NUMERIC(10, 2) DEFAULT 0.00,
    createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table: transactions
-- Columns: 9
-- Primary Key: transactions_pkey (id)
-- Foreign Key: fk_client (clientid -> clients.id)
-- Check Constraint: transactions_account_check
-- =============================================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    clientid INTEGER NOT NULL,
    account VARCHAR(50) NOT NULL,
    particulars VARCHAR(255),
    dr NUMERIC(10, 2) DEFAULT 0.00,
    cr NUMERIC(10, 2) DEFAULT 0.00,
    balance NUMERIC(10, 2) DEFAULT 0.00,
    createdat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_client
        FOREIGN KEY (clientid)
        REFERENCES clients(id)
        ON DELETE CASCADE,
    CONSTRAINT transactions_account_check
        CHECK (account IN ('Cash', 'Bank', 'Net', 'No NET'))
);

-- =============================================
-- Indexes
-- clients: idx_clients_clientname
-- transactions: idx_transactions_clientid, idx_transactions_date
-- =============================================

