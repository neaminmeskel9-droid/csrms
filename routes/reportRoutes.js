const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { isDirector } = require('../middleware/authMiddleware');

router.get('/director/reports/sales', isDirector, reportController.showSalesReport);
router.get('/director/reports/inventory', isDirector, reportController.showInventoryReport);
router.get('/director/reports/procurement', isDirector, reportController.showProcurementReport);

module.exports = router;