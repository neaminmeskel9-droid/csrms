const pool = require('../config/db');

// Search products by name or barcode (for the sales screen)
async function searchProducts(query) {
    const result = await pool.query(
        `SELECT product_id, product_name, barcode, selling_price, quantity_available
         FROM products
         WHERE status = 'active' 
         AND (product_name ILIKE $1 OR barcode ILIKE $1)
         ORDER BY product_name
         LIMIT 20`,
        [`%${query}%`]
    );
    return result.rows;
}

// Get single product for stock check during checkout
async function getProductForSale(productId) {
    const result = await pool.query(
        `SELECT product_id, product_name, selling_price, quantity_available
         FROM products WHERE product_id = $1`,
        [productId]
    );
    return result.rows[0];
}

// Create a complete sale (transaction: sale + items + stock reduction + log)
async function createSale(salesAgentId, cartItems, totalAmount, amountPaid) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert sale record
        const saleResult = await client.query(
            `INSERT INTO sales (sales_agent_id, total_amount, amount_paid)
             VALUES ($1, $2, $3) RETURNING *`,
            [salesAgentId, totalAmount, amountPaid]
        );
        const sale = saleResult.rows[0];

        // Insert each sale item, reduce stock, log inventory change
        for (const item of cartItems) {
            // Check stock is still sufficient
            const stockCheck = await client.query(
                `SELECT quantity_available FROM products WHERE product_id = $1`,
                [item.product_id]
            );
            if (stockCheck.rows[0].quantity_available < item.quantity) {
                throw new Error(`Insufficient stock for product ID ${item.product_id}`);
            }

            // Insert sale item
            await client.query(
                `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price)
                 VALUES ($1, $2, $3, $4)`,
                [sale.sale_id, item.product_id, item.quantity, item.unit_price]
            );

            // Reduce stock
            await client.query(
                `UPDATE products SET quantity_available = quantity_available - $1
                 WHERE product_id = $2`,
                [item.quantity, item.product_id]
            );

            // Log inventory change - Uses your database 'changed_by' column configuration
            await client.query(
                `INSERT INTO inventory_log (product_id, change_type, quantity_change, reason, changed_by)
                 VALUES ($1, 'sale', $2, 'Sold to customer', $3)`,
                [item.product_id, -item.quantity, salesAgentId]
            );
        }

        await client.query('COMMIT');
        return sale;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

// Get full sale details for receipt
async function getSaleReceipt(saleId) {
    // Changed JOIN to LEFT JOIN to dynamically handle any user account safely
    const saleResult = await pool.query(
        `SELECT s.*, u.username as agent_name
         FROM sales s
         LEFT JOIN users u ON s.sales_agent_id = u.user_id
         WHERE s.sale_id = $1`,
         [saleId]
    );
    const sale = saleResult.rows[0];

    if (!sale) {
        throw new Error(`Sale with ID ${saleId} not found`);
    }

    const itemsResult = await pool.query(
        `SELECT si.*, p.product_name
         FROM sale_items si
         JOIN products p ON si.product_id = p.product_id
         WHERE si.sale_id = $1`,
        [saleId]
    );
    sale.items = itemsResult.rows;

    return sale;
}

// Get daily sales for an agent (used on agent dashboard later)
async function getDailySales(agentId) {
    const result = await pool.query(
        `SELECT s.*, COUNT(si.sale_item_id) as item_count
         FROM sales s
         LEFT JOIN sale_items si ON s.sale_id = si.sale_id
         WHERE s.sales_agent_id = $1 AND s.sale_date::date = CURRENT_DATE
         GROUP BY s.sale_id
         ORDER BY s.sale_date DESC`,
        [agentId]
    );
    return result.rows;
}

module.exports = { searchProducts, getProductForSale, createSale, getSaleReceipt, getDailySales };