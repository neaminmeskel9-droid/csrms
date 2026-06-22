const procurementModel = require('../models/procurementModel');
const productModel = require('../models/productModel');

// List all procurements
async function listProcurements(req, res) {
    try {
        const procurements = await procurementModel.getAllProcurements();
        res.render('manager/procurements/index', { 
            procurements, 
            user: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading procurements');
    }
}

// Show create form
async function showCreateForm(req, res) {
    try {
        const products = await productModel.getAllProducts();
        res.render('manager/procurements/create', { 
            products,
            user: req.session.user,
            error: null 
        });
    } catch (err) {
        console.error(err);
        res.redirect('/manager/procurements');
    }
}

// Handle create
async function createProcurement(req, res) {
    const { product_id, supplier_name, quantity_received, cost_price, branch } = req.body;
    try {
        await procurementModel.createProcurement(
            product_id,
            supplier_name,
            parseInt(quantity_received),
            cost_price,
            branch,
            req.session.user.id
        );
        res.redirect('/manager/procurements');
    } catch (err) {
        console.error(err);
        const products = await productModel.getAllProducts();
        res.render('manager/procurements/create', { 
            products,
            user: req.session.user,
            error: 'Error recording procurement' 
        });
    }
}

module.exports = { listProcurements, showCreateForm, createProcurement };