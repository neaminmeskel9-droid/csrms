const express = require('express');
const router = express.Router();
const { isDirector, isManager, isSalesAgent } = require('../middleware/authMiddleware');
const dashboardModel = require('../models/dashboardModel');
const inventoryModel = require('../models/inventoryModel');

// Director dashboard
router.get('/director/dashboard', isDirector, async (req, res) => {
    try {
        const stats = await dashboardModel.getDirectorStats();
        res.render('director/dashboard', { user: req.session.user, stats });
    } catch (err) {
        console.error(err);
        res.render('director/dashboard', { user: req.session.user, stats: {} });
    }
});

// Manager dashboard
router.get('/manager/dashboard', isManager, async (req, res) => {
    try {
        const stats = await dashboardModel.getManagerStats();
        const lowStockProducts = await inventoryModel.getLowStockProducts();
        res.render('manager/dashboard', { user: req.session.user, stats, lowStockProducts });
    } catch (err) {
        console.error(err);
        res.render('manager/dashboard', { user: req.session.user, stats: {}, lowStockProducts: [] });
    }
});

// Agent dashboard
router.get('/agent/dashboard', isSalesAgent, async (req, res) => {
    try {
        const stats = await dashboardModel.getAgentStats(req.session.user.id);
        res.render('agent/dashboard', { user: req.session.user, stats });
    } catch (err) {
        console.error(err);
        res.render('agent/dashboard', { user: req.session.user, stats: {} });
    }
});

module.exports = router;