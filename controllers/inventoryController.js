const inventoryModel = require('../models/inventoryModel');
const productModel = require('../models/productModel');

// View inventory overview
async function viewInventory(req, res) {
    try {
        const inventory = await inventoryModel.getInventoryOverview();
        res.render('manager/inventory/index', { 
            inventory, 
            user: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading inventory');
    }
}

// Show stock adjustment form
async function showAdjustForm(req, res) {
    try {
        const products = await productModel.getAllProducts();
        res.render('manager/inventory/adjust', { 
            products,
            user: req.session.user,
            error: null 
        });
    } catch (err) {
        console.error(err);
        res.redirect('/manager/inventory');
    }
}

// Handle adjustment
async function adjustStock(req, res) {
    const { product_id, adjustment_quantity, reason } = req.body;
    try {
        await inventoryModel.adjustStock(
            product_id,
            parseInt(adjustment_quantity),
            reason,
            req.session.user.id
        );
        res.redirect('/manager/inventory');
    } catch (err) {
        console.error(err);
        const products = await productModel.getAllProducts();
        res.render('manager/inventory/adjust', { 
            products,
            user: req.session.user,
            error: 'Error adjusting stock' 
        });
    }
}

// View inventory history/log
async function viewHistory(req, res) {
    try {
        const logs = await inventoryModel.getAllInventoryLogs();
        res.render('manager/inventory/history', { 
            logs, 
            user: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading history');
    }
}

module.exports = { viewInventory, showAdjustForm, adjustStock, viewHistory };