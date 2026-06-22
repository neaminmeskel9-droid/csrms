const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isManager } = require('../middleware/authMiddleware');

router.get('/manager/categories', isManager, categoryController.listCategories);
router.get('/manager/categories/create', isManager, categoryController.showCreateForm);
router.post('/manager/categories/create', isManager, categoryController.createCategory);
router.get('/manager/categories/edit/:id', isManager, categoryController.showEditForm);
router.post('/manager/categories/edit/:id', isManager, categoryController.updateCategory);
router.post('/manager/categories/toggle/:id', isManager, categoryController.toggleStatus);

module.exports = router;