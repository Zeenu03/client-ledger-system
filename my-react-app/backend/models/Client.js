import pool from '../config/db.js';
import Transaction from './Transaction.js';

const Client = {
    // Get all clients (ordered by newest first)
    getAll: async () => {
        try {
            const result = await pool.query(
                'SELECT * FROM clients ORDER BY createdat DESC'
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching clients: ${error.message}`);
        }
    },

    // Get client by ID
    getById: async (id) => {
        try {
            const result = await pool.query(
                'SELECT * FROM clients WHERE id = $1',
                [id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error fetching client: ${error.message}`);
        }
    },

    // Create new client
    create: async (clientData) => {
        try {
            const { clientname, shopname, mobilenumber, city, openingbalance } = clientData;
            
            const result = await pool.query(
                `INSERT INTO clients (clientname, shopname, mobilenumber, city, openingbalance, createdat)
                 VALUES ($1, $2, $3, $4, $5, NOW())
                 RETURNING *`,
                [clientname, shopname, mobilenumber, city, openingbalance || 0]
            );
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating client: ${error.message}`);
        }
    },

    // Update client
    update: async (id, clientData) => {
        try {
            const { clientname, shopname, mobilenumber, city, openingbalance } = clientData;
            
            const result = await pool.query(
                `UPDATE clients 
                 SET clientname = $1, shopname = $2, mobilenumber = $3, city = $4, openingbalance = $5
                 WHERE id = $6
                 RETURNING *`,
                [clientname, shopname, mobilenumber, city, openingbalance, id]
            );
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating client: ${error.message}`);
        }
    },

    // Delete client and all related transactions
    delete: async (id) => {
        try {
            // Delete all transactions for this client first
            await Transaction.deleteByClientId(id);
            await pool.query('DELETE FROM clients WHERE id = $1', [id]);
            return { message: 'Client and related transactions deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting client: ${error.message}`);
        }
    },

    // Search clients by name or shop name
    search: async (searchTerm) => {
        try {
            const result = await pool.query(
                `SELECT * FROM clients 
                 WHERE clientname ILIKE $1 OR shopname ILIKE $1
                 ORDER BY clientname`,
                [`%${searchTerm}%`]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error searching clients: ${error.message}`);
        }
    },

    // Get client with current balance
    getWithBalance: async (id) => {
        try {
            const result = await pool.query(
                `SELECT 
                    c.id,
                    c.clientname,
                    c.shopname,
                    c.mobilenumber,
                    c.city,
                    c.openingbalance,
                    c.createdat,
                    COALESCE(SUM(t.dr), 0) AS total_debit,
                    COALESCE(SUM(t.cr), 0) AS total_credit,
                    c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) AS current_balance
                 FROM clients c
                 LEFT JOIN transactions t ON c.id = t.clientid
                 WHERE c.id = $1
                 GROUP BY c.id, c.clientname, c.shopname, c.mobilenumber, c.city, c.openingbalance, c.createdat`,
                [id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error fetching client with balance: ${error.message}`);
        }
    },

    // Get all clients with their current balances
    getAllWithBalances: async () => {
        try {
            const result = await pool.query(
                `SELECT 
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
                 ORDER BY c.clientname`
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching clients with balances: ${error.message}`);
        }
    },

    // Get clients with outstanding balance (debtors)
    getDebtors: async () => {
        try {
            const result = await pool.query(
                `SELECT 
                    c.id,
                    c.clientname,
                    c.shopname,
                    c.city,
                    c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) AS current_balance
                 FROM clients c
                 LEFT JOIN transactions t ON c.id = t.clientid
                 GROUP BY c.id, c.clientname, c.shopname, c.city, c.openingbalance
                 HAVING c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) > 0
                 ORDER BY current_balance DESC`
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching debtors: ${error.message}`);
        }
    },

    // Get clients with credit balance (creditors)
    getCreditors: async () => {
        try {
            const result = await pool.query(
                `SELECT 
                    c.id,
                    c.clientname,
                    c.shopname,
                    c.city,
                    c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) AS current_balance
                 FROM clients c
                 LEFT JOIN transactions t ON c.id = t.clientid
                 GROUP BY c.id, c.clientname, c.shopname, c.city, c.openingbalance
                 HAVING c.openingbalance + COALESCE(SUM(t.dr - t.cr), 0) < 0
                 ORDER BY current_balance ASC`
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching creditors: ${error.message}`);
        }
    },

    // Get total client count
    getCount: async () => {
        try {
            const result = await pool.query('SELECT COUNT(*) as total_clients FROM clients');
            return parseInt(result.rows[0].total_clients);
        } catch (error) {
            throw new Error(`Error getting client count: ${error.message}`);
        }
    }
};

export default Client;
