import { Router } from 'express';
import clientController from '../controllers/clientController.js';

const router = Router();

router.get('/', clientController.getAllClients);
router.get('/with-balances', clientController.getAllClientsWithBalances);
router.get('/debtors', clientController.getDebtors);
router.get('/creditors', clientController.getCreditors);
router.get('/count', clientController.getClientCount);
router.get('/search', clientController.searchClients);
router.get('/:id/balance', clientController.getClientWithBalance);
router.get('/:id', clientController.getClientById);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export default router;
