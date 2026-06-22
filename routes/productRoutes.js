const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isManager } = require('../middleware/authMiddleware');

router.get('/manager/products', isManager, productController.listProducts);
router.get('/manager/products/create', isManager, productController.showCreateForm);
router.post('/manager/products/create', isManager, productController.createProduct);
router.get('/manager/products/edit/:id', isManager, productController.showEditForm);
router.post('/manager/products/edit/:id', isManager, productController.updateProduct);
router.post('/manager/products/toggle/:id', isManager, productController.toggleStatus);

module.exports = router;