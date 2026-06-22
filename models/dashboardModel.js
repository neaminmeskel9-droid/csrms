const pool = require('../config/db');

// Director stats
async function getDirectorStats() {
    const salesResult = await pool.query(
        `SELECT COALESCE(SUM(total_amount), 0) as total_sales FROM sales`
    );
    const inventoryResult = await pool.query(
        `SELECT COALESCE(SUM(quantity_available * cost_price), 0) as total_inventory_value FROM products`
    );
    const procurementResult = await pool.query(
        `SELECT COALESCE(SUM(quantity_received * cost_price), 0) as total_procurement_value FROM procurements`
    );
    return {
        totalSales: salesResult.rows[0].total_sales,
        totalInventoryValue: inventoryResult.rows[0].total_inventory_value,
        totalProcurementValue: procurementResult.rows[0].total_procurement_value
    };
}

// Manager stats
async function getManagerStats() {
    const salesResult = await pool.query(
        `SELECT COALESCE(SUM(total_amount), 0) as today_sales, COUNT(*) as sale_count
         FROM sales WHERE sale_date::date = CURRENT_DATE`
    );
    const lowStockResult = await pool.query(
        `SELECT COUNT(*) as low_stock_count FROM products 
         WHERE quantity_available <= reorder_level AND status = 'active'`
    );
    const cashierResult = await pool.query(
        `SELECT u.full_name, COALESCE(SUM(s.total_amount), 0) as total
         FROM users u
         LEFT JOIN sales s ON u.user_id = s.sales_agent_id AND s.sale_date::date = CURRENT_DATE
         WHERE u.role = 'sales_agent'
         GROUP BY u.user_id, u.full_name`
    );
    return {
        todaySales: salesResult.rows[0].today_sales,
        saleCount: salesResult.rows[0].sale_count,
        lowStockCount: lowStockResult.rows[0].low_stock_count,
        cashierSummary: cashierResult.rows
    };
}

// Agent stats
async function getAgentStats(agentId) {
    const result = await pool.query(
        `SELECT COALESCE(SUM(total_amount), 0) as today_sales, COUNT(*) as sale_count
         FROM sales WHERE sales_agent_id = $1 AND sale_date::date = CURRENT_DATE`,
        [agentId]
    );
    return {
        todaySales: result.rows[0].today_sales,
        saleCount: result.rows[0].sale_count
    };
}

module.exports = { getDirectorStats, getManagerStats, getAgentStats };