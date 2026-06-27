const salesModel = require('../models/salesModel');

// NEW: Show the main Agent Dashboard landing page
function showDashboard(req, res) {
    try {
        // Renders your dashboard view at views/agent/dashboard.ejs
        res.render('agent/dashboard', { 
            user: req.session.user 
        });
    } catch (err) {
        console.error("Error rendering agent dashboard:", err);
        res.status(500).send("Internal Server Error");
    }
}

// Show the sales screen (cart lives in session)
function showSalesScreen(req, res) {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    res.render('agent/sales/new', { 
        cart: req.session.cart,
        user: req.session.user,
        error: null,
        searchResults: []
    });
}

// Handle product search (AJAX-free, simple form submit)
async function searchProduct(req, res) {
    const { query } = req.query;
    try {
        const searchResults = query ? await salesModel.searchProducts(query) : [];
        res.render('agent/sales/new', {
            cart: req.session.cart || [],
            user: req.session.user,
            error: null,
            searchResults,
            query
        });
    } catch (err) {
        console.error(err);
        res.render('agent/sales/new', {
            cart: req.session.cart || [],
            user: req.session.user,
            error: 'Search failed',
            searchResults: []
        });
    }
}

// Add item to cart
async function addToCart(req, res) {
    const { product_id, quantity } = req.body;
    try {
        const product = await salesModel.getProductForSale(product_id);
        const qty = parseInt(quantity);

        if (!product) {
            throw new Error('Product not found');
        }
        if (product.quantity_available < qty) {
            throw new Error('Not enough stock available');
        }

        if (!req.session.cart) req.session.cart = [];

        // If item already in cart, increase quantity instead of duplicating
        const existing = req.session.cart.find(item => item.product_id == product_id);
        if (existing) {
            existing.quantity += qty;
        } else {
            req.session.cart.push({
                product_id: product.product_id,
                product_name: product.product_name,
                unit_price: product.selling_price,
                quantity: qty
            });
        }

        res.redirect('/agent/sales/new');
    } catch (err) {
        console.error(err);
        res.render('agent/sales/new', {
            cart: req.session.cart || [],
            user: req.session.user,
            error: err.message,
            searchResults: []
        });
    }
}

// Remove item from cart
function removeFromCart(req, res) {
    const { product_id } = req.params;
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item.product_id != product_id);
    }
    res.redirect('/agent/sales/new');
}

// Show checkout/payment screen
function showCheckout(req, res) {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        return res.redirect('/agent/sales/new');
    }
    const total = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    res.render('agent/sales/checkout', {
        cart,
        total,
        user: req.session.user,
        error: null
    });
}

// Complete the sale
async function completeSale(req, res) {
    const { amount_paid } = req.body;
    const cart = req.session.cart || [];

    try {
        if (cart.length === 0) throw new Error('Cart is empty');

        const total = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
        if (parseFloat(amount_paid) < total) {
            throw new Error('Amount paid is less than total amount');
        }

        const saleId = await salesModel.createSale(req.session.user.id, cart, amount_paid);

        // Clear cart after successful sale
        req.session.cart = [];

        res.redirect(`/agent/sales/receipt/${saleId}`);
    } catch (err) {
        console.error(err);
        const total = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
        res.render('agent/sales/checkout', {
            cart,
            total,
            user: req.session.user,
            error: err.message
        });
    }
}

// Show receipt
async function showReceipt(req, res) {
    try {
        const sale = await salesModel.getSaleReceipt(req.params.id);
        res.render('agent/sales/receipt', { sale, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.redirect('/agent/dashboard');
    }
}

// Added showDashboard into exports down here
module.exports = { 
    showDashboard, 
    showSalesScreen, 
    searchProduct, 
    addToCart, 
    removeFromCart, 
    showCheckout, 
    completeSale, 
    showReceipt 
};