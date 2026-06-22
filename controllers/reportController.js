const reportModel = require('../models/reportModel');

// Show sales report with optional date filter
async function showSalesReport(req, res) {
    try {
        let { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            const today = new Date().toISOString().split('T')[0];
            startDate = today;
            endDate = today;
        }

        const sales = await reportModel.getSalesReport(startDate, endDate);
        const summary = await reportModel.getSalesSummary(startDate, endDate);

        res.render('director/reports/sales', {
            sales,
            summary,
            startDate,
            endDate,
            user: req.session.user
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading sales report');
    }
}

// Show inventory report
async function showInventoryReport(req, res) {
    try {
        const inventory = await reportModel.getInventoryReport();

        res.render('director/reports/inventory', {
            inventory,
            user: req.session.user
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading inventory report');
    }
}

// Show procurement report with optional date filter
async function showProcurementReport(req, res) {
    try {
        let { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            const today = new Date().toISOString().split('T')[0];
            startDate = today;
            endDate = today;
        }

        const procurements = await reportModel.getProcurementReport(startDate, endDate);

        res.render('director/reports/procurement', {
            procurements,
            startDate,
            endDate,
            user: req.session.user
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading procurement report');
    }
}
module.exports = { showSalesReport, showInventoryReport, showProcurementReport };