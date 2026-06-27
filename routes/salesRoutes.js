const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { isSalesAgent } = require('../middleware/authMiddleware');

// 1. Landing Page Dashboard Redirect (maps to /agent/dashboard)
router.get('/dashboard', isSalesAgent, salesController.showDashboard);

// 2. Sales Operations Routes (maps to /agent/sales/...)
router.get('/sales/new', isSalesAgent, salesController.showSalesScreen);
router.get('/sales/search', isSalesAgent, salesController.searchProduct);
router.post('/sales/add', isSalesAgent, salesController.addToCart);
router.post('/sales/remove/:product_id', isSalesAgent, salesController.removeFromCart);
router.get('/sales/checkout', isSalesAgent, salesController.showCheckout);
router.post('/sales/checkout', isSalesAgent, salesController.completeSale);
router.get('/sales/receipt/:id', isSalesAgent, salesController.showReceipt);

module.exports = router;
// final route deployment fix