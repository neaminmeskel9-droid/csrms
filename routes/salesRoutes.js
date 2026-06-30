const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { isSalesAgent } = require('../middleware/authMiddleware');

// Show sales page
router.get('/new', isSalesAgent, salesController.showSalesScreen);

// Search product
router.post('/search', isSalesAgent, salesController.searchProduct);

// Add to cart
router.post('/add-to-cart', isSalesAgent, salesController.addToCart);

// Remove from cart
router.post('/remove-from-cart', isSalesAgent, salesController.removeFromCart);

// Checkout
router.get('/checkout', isSalesAgent, salesController.showCheckout);

// Complete sale
router.post('/complete', isSalesAgent, salesController.completeSale);

// Receipt
router.get('/receipt/:saleId', isSalesAgent, salesController.showReceipt);

module.exports = router;