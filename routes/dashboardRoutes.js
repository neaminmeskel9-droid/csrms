const express = require('express');
const router = express.Router();
const dashboardModel = require('../models/dashboardModel');
const inventoryModel = require('../models/inventoryModel');
const { isAuthenticated, isDirector, isManager, isSalesAgent } = require('../middleware/authMiddleware');

// Director dashboard
router.get('/director/dashboard', isDirector, async (req, res) => {
    try {
        const stats = await dashboardModel.getDirectorStats();
        res.render('director/dashboard', {
            user: req.session.user,
            stats
        });
    } catch (err) {
        console.error('Director dashboard error:', err);
        res.send('Error loading director dashboard: ' + err.message);
    }
});

// Manager dashboard
router.get('/manager/dashboard', isManager, async (req, res) => {
    try {
        const stats = await dashboardModel.getManagerStats();
        const lowStockProducts = await inventoryModel.getLowStockProducts();
        res.render('manager/dashboard', {
            user: req.session.user,
            stats,
            lowStockProducts
        });
    } catch (err) {
        console.error('Manager dashboard error:', err);
        res.send('Error loading manager dashboard: ' + err.message);
    }
});

// Agent dashboard
router.get('/agent/dashboard', isSalesAgent, async (req, res) => {
    try {
        const stats = await dashboardModel.getAgentStats(req.session.user.id);
        res.render('agent/dashboard', {
            user: req.session.user,
            stats
        });
    } catch (err) {
        console.error('Agent dashboard error:', err);
        res.send('Error loading agent dashboard: ' + err.message);
    }
});

module.exports = router;