import Transaction from '../models/Transaction.js';

const transactionController = {
    // GET /api/transactions - Get all transactions
    getAllTransactions: async (req, res) => {
        try {
            const transactions = await Transaction.getAll();
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/transactions/:id - Get single transaction by ID
    getTransactionById: async (req, res) => {
        try {
            const transaction = await Transaction.getById(req.params.id);
            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/transactions/client/:clientId - Get all transactions for a client
    getTransactionsByClientId: async (req, res) => {
        try {
            const transactions = await Transaction.getByClientId(req.params.clientId);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/transactions/recent?limit=10 - Get recent transactions
    getRecentTransactions: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const transactions = await Transaction.getRecent(limit);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/transactions - Create new transaction
    createTransaction: async (req, res) => {
        try {
            const { date, clientid, account, particulars, dr, cr, balance } = req.body;

            // Validation
            if (!date || !clientid || !account) {
                return res.status(400).json({ 
                    error: 'Date, client ID, and account are required' 
                });
            }

            // Validation - Net account can only have debit, not credit
            if (account === 'Net' && cr > 0) {
                return res.status(400).json({ 
                    error: 'Net account can only have Debit amount, not Credit' 
                });
            }

            const newTransaction = await Transaction.create({
                date,
                clientid,
                account,
                particulars,
                dr: dr || 0,
                cr: account === 'Net' ? 0 : (cr || 0),
                balance
            });

            res.status(201).json(newTransaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // PUT /api/transactions/:id - Update transaction
    updateTransaction: async (req, res) => {
        try {
            const { date, account, particulars, dr, cr, balance } = req.body;

            // Validation
            if (!date || !account) {
                return res.status(400).json({ 
                    error: 'Date and account are required' 
                });
            }

            // Validation - Net account can only have debit, not credit
            if (account === 'Net' && cr > 0) {
                return res.status(400).json({ 
                    error: 'Net account can only have Debit amount, not Credit' 
                });
            }

            const updatedTransaction = await Transaction.update(req.params.id, {
                date,
                account,
                particulars,
                dr: dr || 0,
                cr: account === 'Net' ? 0 : (cr || 0),
                balance
            });

            if (!updatedTransaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            res.json(updatedTransaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE /api/transactions/:id - Delete transaction
    deleteTransaction: async (req, res) => {
        try {
            await Transaction.delete(req.params.id);
            res.json({ message: 'Transaction deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/transactions/ledger/:clientId?startDate=&endDate= - Get ledger statement
    getLedgerStatement: async (req, res) => {
        try {
            const { clientId } = req.params;
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ 
                    error: 'Start date and end date are required' 
                });
            }

            const ledger = await Transaction.getLedger(clientId, startDate, endDate);
            res.json(ledger);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/transactions/ledger/:clientId/running?startDate=&endDate= - Get ledger with running balance
    getLedgerWithRunningBalance: async (req, res) => {
        try {
            const { clientId } = req.params;
            const { startDate, endDate } = req.query;

            const ledger = await Transaction.getLedgerWithRunningBalance(
                clientId, 
                startDate, 
                endDate
            );
            res.json(ledger);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/transactions/summary/date-range?startDate=&endDate= - Get summary by date range
    getSummaryByDateRange: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ 
                    error: 'Start date and end date are required' 
                });
            }

            const summary = await Transaction.getSummaryByDateRange(startDate, endDate);
            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/transactions/summary/by-account - Get summary by account type
    getSummaryByAccount: async (req, res) => {
        try {
            const summary = await Transaction.getSummaryByAccount();
            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/transactions/summary/daily?startDate=&endDate= - Get daily summary
    getDailySummary: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ 
                    error: 'Start date and end date are required' 
                });
            }

            const summary = await Transaction.getDailySummary(startDate, endDate);
            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/transactions/summary/monthly?startDate=&endDate= - Get monthly summary
    getMonthlySummary: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ 
                    error: 'Start date and end date are required' 
                });
            }

            const summary = await Transaction.getMonthlySummary(startDate, endDate);
            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/transactions/recalculate/:clientId - Recalculate balance for a client
    recalculateBalance: async (req, res) => {
        try {
            const result = await Transaction.recalculateBalance(req.params.clientId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default transactionController;
