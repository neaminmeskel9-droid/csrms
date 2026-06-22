const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { isManager } = require('../middleware/authMiddleware');

router.get('/manager/inventory', isManager, inventoryController.viewInventory);
router.get('/manager/inventory/adjust', isManager, inventoryController.showAdjustForm);
router.post('/manager/inventory/adjust', isManager, inventoryController.adjustStock);
router.get('/manager/inventory/history', isManager, inventoryController.viewHistory);

module.exports = router;