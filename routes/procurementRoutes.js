const express = require('express');
const router = express.Router();
const procurementController = require('../controllers/procurementController');
const { isManager } = require('../middleware/authMiddleware');

router.get('/manager/procurements', isManager, procurementController.listProcurements);
router.get('/manager/procurements/create', isManager, procurementController.showCreateForm);
router.post('/manager/procurements/create', isManager, procurementController.createProcurement);

module.exports = router;