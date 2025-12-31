import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import clientRoutes from './routes/clientRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/clients', clientRoutes);
app.use('/api/transactions', transactionRoutes);

// Test route - Check if server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!' });
});

// Test route - Check database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        res.json({
            status: 'Database connected!',
            serverTime: result.rows[0].current_time
        });
    } catch (error) {
        res.status(500).json({
            status: 'Database connection failed',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
