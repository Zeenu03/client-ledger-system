import pool from '../config/db.js';

const Transaction = {
    // Get all transactions with client information
    getAll: async () => {
        try {
            const result = await pool.query(
                `SELECT t.*, c.clientname, c.shopname
                 FROM transactions t
                 LEFT JOIN clients c ON t.clientid = c.id
                 ORDER BY t.date DESC, t.id DESC`
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching transactions: ${error.message}`);
        }
    },

    // Get transaction by ID
    getById: async (id) => {
        try {
            const result = await pool.query(
                `SELECT t.*, c.clientname, c.shopname
                 FROM transactions t
                 LEFT JOIN clients c ON t.clientid = c.id
                 WHERE t.id = $1`,
                [id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error fetching transaction: ${error.message}`);
        }
    },

    // Get all transactions for a specific client
    getByClientId: async (clientId) => {
        try {
            const result = await pool.query(
                `SELECT * FROM transactions 
                 WHERE clientid = $1 
                 ORDER BY date ASC, id ASC`,
                [clientId]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching client transactions: ${error.message}`);
        }
    },

    // Create new transaction
    create: async (transactionData) => {
        try {
            const { date, clientid, account, particulars, dr, cr, balance } = transactionData;
            
            const result = await pool.query(
                `INSERT INTO transactions (date, clientid, account, particulars, dr, cr, balance, createdat)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                 RETURNING *`,
                [date, clientid, account, particulars, dr || 0, cr || 0, balance]
            );
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating transaction: ${error.message}`);
        }
    },

    // Update transaction
    update: async (id, transactionData) => {
        try {
            const { date, account, particulars, dr, cr, balance } = transactionData;
            
            const result = await pool.query(
                `UPDATE transactions 
                 SET date = $1, account = $2, particulars = $3, dr = $4, cr = $5, balance = $6
                 WHERE id = $7
                 RETURNING *`,
                [date, account, particulars, dr, cr, balance, id]
            );
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating transaction: ${error.message}`);
        }
    },

    // Delete transaction
    delete: async (id) => {
        try {
            await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
            return { message: 'Transaction deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting transaction: ${error.message}`);
        }
    },

    // Get ledger statement for a client (with date range)
    getLedger: async (clientId, startDate, endDate) => {
        try {
            const result = await pool.query(
                `SELECT * FROM transactions 
                 WHERE clientid = $1 AND date BETWEEN $2 AND $3
                 ORDER BY date ASC, id ASC`,
                [clientId, startDate, endDate]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching ledger: ${error.message}`);
        }
    },

    // Get ledger with running balance for a client
    getLedgerWithRunningBalance: async (clientId, startDate = null, endDate = null) => {
        try {
            let query = `
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
            `;
            
            const params = [clientId];
            
            if (startDate && endDate) {
                query += ' AND t.date BETWEEN $2 AND $3';
                params.push(startDate, endDate);
            }
            
            query += ' ORDER BY t.date ASC, t.id ASC';
            
            const result = await pool.query(query, params);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching ledger with running balance: ${error.message}`);
        }
    },

    // Get recent transactions (limit)
    getRecent: async (limit = 10) => {
        try {
            const result = await pool.query(
                `SELECT t.*, c.clientname, c.shopname
                 FROM transactions t
                 LEFT JOIN clients c ON t.clientid = c.id
                 ORDER BY t.createdat DESC
                 LIMIT $1`,
                [limit]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching recent transactions: ${error.message}`);
        }
    },

    // Get transaction summary by date range
    getSummaryByDateRange: async (startDate, endDate) => {
        try {
            const result = await pool.query(
                `SELECT 
                    COUNT(*) AS total_transactions,
                    COALESCE(SUM(dr), 0) AS total_debit,
                    COALESCE(SUM(cr), 0) AS total_credit
                 FROM transactions
                 WHERE date BETWEEN $1 AND $2`,
                [startDate, endDate]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error fetching transaction summary: ${error.message}`);
        }
    },

    // Get transaction summary by account type
    getSummaryByAccount: async () => {
        try {
            const result = await pool.query(
                `SELECT 
                    account,
                    COUNT(*) AS transaction_count,
                    COALESCE(SUM(dr), 0) AS total_debit,
                    COALESCE(SUM(cr), 0) AS total_credit
                 FROM transactions
                 GROUP BY account
                 ORDER BY transaction_count DESC`
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching account summary: ${error.message}`);
        }
    },

    // Get daily transaction summary
    getDailySummary: async (startDate, endDate) => {
        try {
            const result = await pool.query(
                `SELECT 
                    date,
                    COUNT(*) AS transaction_count,
                    COALESCE(SUM(dr), 0) AS total_debit,
                    COALESCE(SUM(cr), 0) AS total_credit
                 FROM transactions
                 WHERE date BETWEEN $1 AND $2
                 GROUP BY date
                 ORDER BY date DESC`,
                [startDate, endDate]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching daily summary: ${error.message}`);
        }
    },

    // Get monthly transaction summary
    getMonthlySummary: async (startDate, endDate) => {
        try {
            const result = await pool.query(
                `SELECT 
                    DATE_TRUNC('month', date) AS month,
                    COUNT(*) AS transaction_count,
                    COALESCE(SUM(dr), 0) AS total_debit,
                    COALESCE(SUM(cr), 0) AS total_credit
                 FROM transactions
                 WHERE date BETWEEN $1 AND $2
                 GROUP BY DATE_TRUNC('month', date)
                 ORDER BY month DESC`,
                [startDate, endDate]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching monthly summary: ${error.message}`);
        }
    },

    // Recalculate balance for all transactions of a client (utility function)
    recalculateBalance: async (clientId) => {
        try {
            await pool.query(
                `WITH running_totals AS (
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
                WHERE t.id = rt.id`,
                [clientId]
            );
            return { message: 'Balances recalculated successfully' };
        } catch (error) {
            throw new Error(`Error recalculating balance: ${error.message}`);
        }
    },

    // Delete all transactions for a client
    deleteByClientId: async (clientId) => {
        try {
            await pool.query('DELETE FROM transactions WHERE clientid = $1', [clientId]);
            return { message: 'All client transactions deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting client transactions: ${error.message}`);
        }
    }
};

export default Transaction;
