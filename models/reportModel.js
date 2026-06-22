const pool = require('../config/db');

// Sales report - filtered by date range
async function getSalesReport(startDate, endDate) {
    const result = await pool.query(
        `SELECT s.sale_id, s.sale_date, s.total_amount, s.amount_paid,
                u.full_name as agent_name
         FROM sales s
         JOIN users u ON s.sales_agent_id = u.user_id
         WHERE s.sale_date::date BETWEEN $1 AND $2
         ORDER BY s.sale_date DESC`,
        [startDate, endDate]
    );
    return result.rows;
}

// Sales report summary totals
async function getSalesSummary(startDate, endDate) {
    const result = await pool.query(
        `SELECT COUNT(*) as total_transactions, COALESCE(SUM(total_amount), 0) as total_revenue
         FROM sales
         WHERE sale_date::date BETWEEN $1 AND $2`,
        [startDate, endDate]
    );
    return result.rows[0];
}

module.exports = { getSalesReport, getSalesSummary };
// Inventory report - current stock and value
async function getInventoryReport() {
    const result = await pool.query(
        `SELECT p.product_id, p.product_name, p.quantity_available, p.cost_price, p.selling_price,
                (p.quantity_available * p.cost_price) as stock_value,
                c.category_name as category_name,
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

// Procurement report - all purchases
async function getProcurementReport(startDate, endDate) {
    const result = await pool.query(
        `SELECT pr.procurement_id, pr.date_received, pr.quantity_received, pr.cost_price,
                pr.supplier_name, pr.branch, p.product_name, u.full_name as received_by_name
         FROM procurements pr
         JOIN products p ON pr.product_id = p.product_id
         JOIN users u ON pr.received_by = u.user_id
         WHERE pr.date_received::date BETWEEN $1 AND $2
         ORDER BY pr.date_received DESC`,
        [startDate, endDate]
    );
    return result.rows;
}
module.exports = { getSalesReport, getSalesSummary, getInventoryReport, getProcurementReport };