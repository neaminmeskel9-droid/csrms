const pool = require('../config/db');

// Get all procurements with product and user info
async function getAllProcurements() {
    const result = await pool.query(
        `SELECT pr.*, p.product_name, u.full_name as received_by_name
         FROM procurements pr
         JOIN products p ON pr.product_id = p.product_id
         LEFT JOIN users u ON pr.received_by = u.user_id
         ORDER BY pr.date_received DESC`
    );
    return result.rows;
}

// Get single procurement
async function getProcurementById(id) {
    const result = await pool.query(
        `SELECT pr.*, p.product_name
         FROM procurements pr
         JOIN products p ON pr.product_id = p.product_id
         WHERE pr.procurement_id = $1`,
        [id]
    );
    return result.rows[0];
}

// Create procurement AND increase stock (transaction)
async function createProcurement(productId, supplierName, quantityReceived, costPrice, branch, receivedBy) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert procurement record
        const procResult = await client.query(
            `INSERT INTO procurements (product_id, supplier_name, quantity_received, cost_price, branch, received_by)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [productId, supplierName, quantityReceived, costPrice, branch, receivedBy]
        );

        // Increase product stock
        await client.query(
            `UPDATE products SET quantity_available = quantity_available + $1
             WHERE product_id = $2`,
            [quantityReceived, productId]
        );

        // Log in inventory_log
        await client.query(
            `INSERT INTO inventory_log (product_id, change_type, quantity_change, reason, performed_by)
             VALUES ($1, 'procurement', $2, 'Stock received from supplier', $3)`,
            [productId, quantityReceived, receivedBy]
        );

        await client.query('COMMIT');
        return procResult.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { getAllProcurements, getProcurementById, createProcurement };