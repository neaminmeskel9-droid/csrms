const express = require('express');
const router = express.Router();
const cashierController = require('../controllers/cashierController');
const { isManager } = require('../middleware/authMiddleware');

router.get('/manager/cashier-balancing', isManager, cashierController.showBalancingForm);
router.get('/manager/cashier-balancing/history', isManager, cashierController.viewHistory);
router.post('/manager/cashier-balancing/submit', isManager, cashierController.submitBalancing);
router.get('/manager/cashier-balancing/:agentId', isManager, cashierController.showBalanceEntry);

module.exports = router;