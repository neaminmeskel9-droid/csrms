const pool = require('../config/db');

// Get all products with stock info (for inventory view)
async function getInventoryOverview() {
    const result = await pool.query(
        `SELECT p.product_id, p.product_name, c.category_name, 
                p.quantity_available, p.reorder_level, p.status,
                CASE 
                    WHEN p.quantity_available = 0 THEN 'out_of_stock'
                    WHEN p.quantity_available <= p.reorder_level THEN 'low_stock'
                    ELSE 'ok'
                END as stock_status
         FROM products p
         JOIN categories c ON p.category_id = c.category_id
         ORDER BY p.product_name`
    );
    return result.rows;
}

// Get inventory log history for a product
async function getInventoryHistory(productId) {
    const result = await pool.query(
        `SELECT il.*, u.full_name as performed_by_name
         FROM inventory_log il
         LEFT JOIN users u ON il.performed_by = u.user_id
         WHERE il.product_id = $1
         ORDER BY il.created_at DESC`,
        [productId]
    );
    return result.rows;
}

// Get all inventory log entries (for general history view)
async function getAllInventoryLogs() {
    const result = await pool.query(
        `SELECT il.*, p.product_name, u.full_name as performed_by_name
         FROM inventory_log il
         JOIN products p ON il.product_id = p.product_id
         LEFT JOIN users u ON il.performed_by = u.user_id
         ORDER BY il.created_at DESC
         LIMIT 100`
    );
    return result.rows;
}

// Manual stock adjustment AND log it (transaction)
async function adjustStock(productId, quantityChange, reason, performedBy) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Update stock (quantityChange can be negative)
        await client.query(
            `UPDATE products SET quantity_available = quantity_available + $1
             WHERE product_id = $2`,
            [quantityChange, productId]
        );

        // Log the adjustment
        const logResult = await client.query(
            `INSERT INTO inventory_log (product_id, change_type, quantity_change, reason, performed_by)
             VALUES ($1, 'adjustment', $2, $3, $4) RETURNING *`,
            [productId, quantityChange, reason, performedBy]
        );

        await client.query('COMMIT');
        return logResult.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

// Get low stock products (for notifications later)
async function getLowStockProducts() {
    const result = await pool.query(
        `SELECT product_id, product_name, quantity_available, reorder_level
         FROM products
         WHERE quantity_available <= reorder_level AND status = 'active'
         ORDER BY quantity_available ASC`
    );
    return result.rows;
}

module.exports = { 
    getInventoryOverview, 
    getInventoryHistory, 
    getAllInventoryLogs, 
    adjustStock, 
    getLowStockProducts 
};