const salesModel = require('../models/salesModel');

// Show sales screen
async function showSalesScreen(req, res) {
    try {
        if (!req.session.cart) {
            req.session.cart = [];
        }
        res.render('agent/sales/new', {
            user: req.session.user,
            cart: req.session.cart,
            searchResults: [],
            error: null
        });
    } catch (err) {
        console.error('showSalesScreen error:', err);
        res.send('Error loading sales screen: ' + err.message);
    }
}

// Search for a product
async function searchProduct(req, res) {
    try {
        const { query } = req.body;
        const searchResults = await salesModel.searchProducts(query);
        res.render('agent/sales/sales', {
            user: req.session.user,
            cart: req.session.cart || [],
            searchResults,
            error: null
        });
    } catch (err) {
        console.error('searchProduct error:', err);
        res.send('Error searching products: ' + err.message);
    }
}

// Add product to cart
async function addToCart(req, res) {
    try {
        const { product_id, quantity } = req.body;
        const product = await salesModel.getProductForSale(product_id);

        if (!product) {
            return res.redirect('/agent/sales/sales');
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const existingItem = req.session.cart.find(
            item => item.product_id == product_id
        );

        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
            existingItem.subtotal = existingItem.quantity * existingItem.unit_price;
        } else {
            req.session.cart.push({
                product_id: product.product_id,
                product_name: product.product_name,
                unit_price: product.selling_price,
                quantity: parseInt(quantity),
                subtotal: parseInt(quantity) * product.selling_price
            });
        }

        res.redirect('/agent/sales/sales');
    } catch (err) {
        console.error('addToCart error:', err);
        res.send('Error adding to cart: ' + err.message);
    }
}

// Remove item from cart
async function removeFromCart(req, res) {
    try {
        const { product_id } = req.body;
        req.session.cart = (req.session.cart || []).filter(
            item => item.product_id != product_id
        );
        res.redirect('/agent/sales/sales');
    } catch (err) {
        console.error('removeFromCart error:', err);
        res.send('Error removing from cart: ' + err.message);
    }
}

// Show checkout page
async function showCheckout(req, res) {
    try {
        const cart = req.session.cart || [];
        const total = cart.reduce((sum, item) => sum + Number(item.subtotal), 0);
        res.render('agent/sales/checkout', {
            user: req.session.user,
            cart,
            total,
            error: null
        });
    } catch (err) {
        console.error('showCheckout error:', err);
        res.send('Error loading checkout: ' + err.message);
    }
}

// Complete the sale
async function completeSale(req, res) {
    try {
        const { amount_paid } = req.body;
        const cart = req.session.cart || [];

        if (cart.length === 0) {
            return res.redirect('/agent/sales/sales');
        }

        const total = cart.reduce((sum, item) => sum + Number(item.subtotal), 0);

        if (parseFloat(amount_paid) < total) {
            return res.render('agent/sales/checkout', {
                user: req.session.user,
                cart,
                total,
                error: 'Amount paid is less than total'
            });
        }

        const sale = await salesModel.createSale(
            req.session.user.id,
            cart,
            total,
            parseFloat(amount_paid)
        );

        req.session.cart = [];
        res.redirect('/agent/sales/receipt/' + sale.sale_id);
    } catch (err) {
        console.error('completeSale error:', err);
        res.send('Error completing sale: ' + err.message);
    }
}

// Show receipt
async function showReceipt(req, res) {
    try {
        const { saleId } = req.params;
        const receipt = await salesModel.getSaleReceipt(saleId);
        res.render('agent/sales/receipt', {
            user: req.session.user,
            receipt
        });
    } catch (err) {
        console.error('showReceipt error:', err);
        res.send('Error loading receipt: ' + err.message);
    }
}

module.exports = {
    showSalesScreen,
    searchProduct,
    addToCart,
    removeFromCart,
    showCheckout,
    completeSale,
    showReceipt
};