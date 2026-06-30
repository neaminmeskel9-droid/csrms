const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { isSalesAgent } = require('../middleware/authMiddleware');

router.get('/agent/sales/new', isSalesAgent, salesController.showSalesScreen);
router.get('/agent/sales/search', isSalesAgent, salesController.searchProduct);
router.post('/agent/sales/add', isSalesAgent, salesController.addToCart);
router.post('/agent/sales/remove/:productId', isSalesAgent, salesController.removeFromCart);
router.get('/agent/sales/checkout', isSalesAgent, salesController.showCheckout);
router.post('/agent/sales/complete', isSalesAgent, salesController.completeSale);
router.get('/agent/sales/receipt/:saleId', isSalesAgent, salesController.showReceipt);

module.exports = router;