import { Router } from 'express';
import transactionController from '../controllers/transactionController.js';

const router = Router();

router.get('/', transactionController.getAllTransactions);
router.get('/recent', transactionController.getRecentTransactions);
router.get('/summary/by-account', transactionController.getSummaryByAccount);
router.get('/summary/date-range', transactionController.getSummaryByDateRange);
router.get('/summary/daily', transactionController.getDailySummary);
router.get('/summary/monthly', transactionController.getMonthlySummary);
router.get('/ledger/:clientId/running', transactionController.getLedgerWithRunningBalance);
router.get('/ledger/:clientId', transactionController.getLedgerStatement);
router.get('/client/:clientId', transactionController.getTransactionsByClientId);
router.get('/:id', transactionController.getTransactionById);
router.post('/', transactionController.createTransaction);
router.post('/recalculate/:clientId', transactionController.recalculateBalance);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;
