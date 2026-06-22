const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');

// View all products
async function listProducts(req, res) {
    try {
        const products = await productModel.getAllProducts();
        res.render('manager/products/index', { 
            products, 
            user: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading products');
    }
}

// Show create form
async function showCreateForm(req, res) {
    try {
        const categories = await categoryModel.getAllCategories();
        res.render('manager/products/create', { 
            categories,
            user: req.session.user,
            error: null 
        });
    } catch (err) {
        console.error(err);
        res.redirect('/manager/products');
    }
}

// Handle create
async function createProduct(req, res) {
    const { category_id, product_name, barcode, description, cost_price, selling_price, reorder_level } = req.body;
    try {
        await productModel.createProduct(
            category_id, product_name, barcode, 
            description, cost_price, selling_price, reorder_level
        );
        res.redirect('/manager/products');
    } catch (err) {
        console.error(err);
        const categories = await categoryModel.getAllCategories();
        res.render('manager/products/create', { 
            categories,
            user: req.session.user,
            error: 'Error creating product' 
        });
    }
}

// Show edit form
async function showEditForm(req, res) {
    try {
        const product = await productModel.getProductById(req.params.id);
        const categories = await categoryModel.getAllCategories();
        res.render('manager/products/edit', { 
            product,
            categories,
            user: req.session.user,
            error: null 
        });
    } catch (err) {
        console.error(err);
        res.redirect('/manager/products');
    }
}

// Handle edit
async function updateProduct(req, res) {
    const { category_id, product_name, barcode, description, cost_price, selling_price, reorder_level } = req.body;
    try {
        await productModel.updateProduct(
            req.params.id, category_id, product_name, barcode,
            description, cost_price, selling_price, reorder_level
        );
        res.redirect('/manager/products');
    } catch (err) {
        console.error(err);
        res.redirect('/manager/products');
    }
}

// Toggle status
async function toggleStatus(req, res) {
    try {
        const product = await productModel.getProductById(req.params.id);
        const newStatus = product.status === 'active' ? 'inactive' : 'active';
        await productModel.toggleProductStatus(req.params.id, newStatus);
        res.redirect('/manager/products');
    } catch (err) {
        console.error(err);
        res.redirect('/manager/products');
    }
}

module.exports = { listProducts, showCreateForm, createProduct, showEditForm, updateProduct, toggleStatus };