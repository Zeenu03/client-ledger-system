-- =============================================
-- SAMPLE DATA FOR ACCOUNTING APPLICATION
-- This script adds sample clients and transactions
-- =============================================

-- =============================================
-- Insert Sample Clients
-- =============================================

INSERT INTO clients (clientname, shopname, mobilenumber, city, openingbalance) VALUES
('Rajesh Kumar', 'Kumar Electronics', '9876543210', 'Mumbai', 15000.00),
('Priya Sharma', 'Sharma Garments', '9876543211', 'Delhi', 25000.00),
('Amit Patel', 'Patel Hardware Store', '9876543212', 'Ahmedabad', -5000.00),
('Sneha Gupta', 'Gupta Jewellers', '9876543213', 'Jaipur', 50000.00),
('Vikram Singh', 'Singh Automobiles', '9876543214', 'Pune', 0.00),
('Anjali Reddy', 'Reddy Textiles', '9876543215', 'Hyderabad', 30000.00),
('Rahul Verma', 'Verma Medical Store', '9876543216', 'Lucknow', 12000.00),
('Meera Iyer', 'Iyer Stationery', '9876543217', 'Chennai', 8000.00),
('Arjun Desai', 'Desai Furniture Mart', '9876543218', 'Bangalore', -2000.00),
('Kavita Joshi', 'Joshi Cosmetics', '9876543219', 'Indore', 18000.00);

-- =============================================
-- Insert Sample Transactions
-- Note: Balance calculation should ideally be done
-- by application logic or triggers
-- =============================================

-- Transactions for Client 1 (Rajesh Kumar)
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance) VALUES
('2025-01-05', 1, 'Cash', 'Opening Balance', 15000.00, 0.00, 15000.00),
('2025-01-10', 1, 'Cash', 'Payment Received', 0.00, 5000.00, 10000.00),
('2025-01-15', 1, 'Bank', 'Goods Sold', 8000.00, 0.00, 18000.00),
('2025-01-20', 1, 'Cash', 'Cash Payment', 0.00, 3000.00, 15000.00),
('2025-02-01', 1, 'Net', 'Online Transfer', 0.00, 7000.00, 8000.00);

-- Transactions for Client 2 (Priya Sharma)
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance) VALUES
('2025-01-05', 2, 'Cash', 'Opening Balance', 25000.00, 0.00, 25000.00),
('2025-01-12', 2, 'Cash', 'Goods Purchase', 12000.00, 0.00, 37000.00),
('2025-01-18', 2, 'Bank', 'Payment Received', 0.00, 15000.00, 22000.00),
('2025-01-25', 2, 'Cash', 'Service Charge', 500.00, 0.00, 22500.00),
('2025-02-05', 2, 'Net', 'Payment Received', 0.00, 10000.00, 12500.00);

-- Transactions for Client 3 (Amit Patel)
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance) VALUES
('2025-01-05', 3, 'Cash', 'Opening Balance', 0.00, 5000.00, -5000.00),
('2025-01-08', 3, 'Cash', 'Goods Sold', 15000.00, 0.00, 10000.00),
('2025-01-14', 3, 'Bank', 'Payment Made', 0.00, 8000.00, 2000.00),
('2025-01-22', 3, 'Cash', 'Cash Sales', 5000.00, 0.00, 7000.00),
('2025-02-08', 3, 'Net', 'Online Payment', 0.00, 2000.00, 5000.00);

-- Transactions for Client 4 (Sneha Gupta)
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance) VALUES
('2025-01-05', 4, 'Cash', 'Opening Balance', 50000.00, 0.00, 50000.00),
('2025-01-11', 4, 'Bank', 'Gold Purchase', 25000.00, 0.00, 75000.00),
('2025-01-17', 4, 'Cash', 'Payment Received', 0.00, 30000.00, 45000.00),
('2025-01-28', 4, 'Net', 'Online Purchase', 10000.00, 0.00, 55000.00),
('2025-02-10', 4, 'Bank', 'Payment Received', 0.00, 20000.00, 35000.00);

-- Transactions for Client 5 (Vikram Singh)
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance) VALUES
('2025-01-06', 5, 'Cash', 'Initial Purchase', 20000.00, 0.00, 20000.00),
('2025-01-13', 5, 'Bank', 'Part Payment', 0.00, 10000.00, 10000.00),
('2025-01-19', 5, 'Cash', 'Spare Parts', 5000.00, 0.00, 15000.00),
('2025-01-26', 5, 'Cash', 'Payment Received', 0.00, 8000.00, 7000.00);

-- Transactions for Client 6 (Anjali Reddy)
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance) VALUES
('2025-01-05', 6, 'Cash', 'Opening Balance', 30000.00, 0.00, 30000.00),
('2025-01-09', 6, 'Cash', 'Fabric Purchase', 18000.00, 0.00, 48000.00),
('2025-01-16', 6, 'Bank', 'Payment Made', 0.00, 25000.00, 23000.00),
('2025-02-02', 6, 'Net', 'Online Order', 12000.00, 0.00, 35000.00),
('2025-02-12', 6, 'Cash', 'Cash Payment', 0.00, 15000.00, 20000.00);

-- Transactions for Client 7 (Rahul Verma)
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance) VALUES
('2025-01-05', 7, 'Cash', 'Opening Balance', 12000.00, 0.00, 12000.00),
('2025-01-10', 7, 'Cash', 'Medicine Purchase', 8000.00, 0.00, 20000.00),
('2025-01-21', 7, 'Bank', 'Payment Received', 0.00, 12000.00, 8000.00),
('2025-02-06', 7, 'Cash', 'Goods Sold', 6000.00, 0.00, 14000.00);

-- Transactions for Client 8 (Meera Iyer)
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance) VALUES
('2025-01-05', 8, 'Cash', 'Opening Balance', 8000.00, 0.00, 8000.00),
('2025-01-12', 8, 'Cash', 'Stationery Sale', 4000.00, 0.00, 12000.00),
('2025-01-23', 8, 'Cash', 'Payment Made', 0.00, 6000.00, 6000.00),
('2025-02-09', 8, 'Net', 'Online Payment', 0.00, 3000.00, 3000.00);

-- Transactions for Client 9 (Arjun Desai)
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance) VALUES
('2025-01-05', 9, 'Cash', 'Opening Balance', 0.00, 2000.00, -2000.00),
('2025-01-11', 9, 'Cash', 'Furniture Sale', 25000.00, 0.00, 23000.00),
('2025-01-18', 9, 'Bank', 'Payment Made', 0.00, 15000.00, 8000.00),
('2025-02-04', 9, 'Cash', 'Cash Sale', 10000.00, 0.00, 18000.00);

-- Transactions for Client 10 (Kavita Joshi)
INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance) VALUES
('2025-01-05', 10, 'Cash', 'Opening Balance', 18000.00, 0.00, 18000.00),
('2025-01-14', 10, 'Cash', 'Product Purchase', 12000.00, 0.00, 30000.00),
('2025-01-22', 10, 'Bank', 'Payment Received', 0.00, 20000.00, 10000.00),
('2025-02-07', 10, 'Net', 'Online Sale', 8000.00, 0.00, 18000.00);

-- =============================================
-- Verification Queries (commented out)
-- =============================================

-- SELECT COUNT(*) FROM clients;
-- SELECT COUNT(*) FROM transactions;
-- SELECT c.clientname, COUNT(t.id) as transaction_count 
-- FROM clients c 
-- LEFT JOIN transactions t ON c.id = t.clientid 
-- GROUP BY c.id, c.clientname 
-- ORDER BY c.id;
