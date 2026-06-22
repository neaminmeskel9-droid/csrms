const pool = require('../config/db');

// Get all sales agents
async function getAllAgents() {
    const result = await pool.query(
        `SELECT user_id, full_name FROM users WHERE role = 'sales_agent' AND status = 'active'`
    );
    return result.rows;
}

// Get an agent's total sales for today (not yet balanced)
async function getAgentTodaySales(agentId) {
    const result = await pool.query(
        `SELECT COALESCE(SUM(total_amount), 0) as total_sales
         FROM sales WHERE sales_agent_id = $1 AND sale_date::date = CURRENT_DATE`,
        [agentId]
    );
    return result.rows[0].total_sales;
}

// Record a cashier balancing entry
async function createBalancing(agentId, totalSales, cashCollected, approvedBy) {
    const variance = cashCollected - totalSales;
    const result = await pool.query(
        `INSERT INTO cashier_balancing (sales_agent_id, total_sales, cash_collected, variance, approved_by)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [agentId, totalSales, cashCollected, variance, approvedBy]
    );
    return result.rows[0];
}

// Get all balancing history
async function getAllBalancing() {
    const result = await pool.query(
        `SELECT cb.*, u1.full_name as agent_name, u2.full_name as approved_by_name
         FROM cashier_balancing cb
         JOIN users u1 ON cb.sales_agent_id = u1.user_id
         LEFT JOIN users u2 ON cb.approved_by = u2.user_id
         ORDER BY cb.balance_date DESC`
    );
    return result.rows;
}

module.exports = { getAllAgents, getAgentTodaySales, createBalancing, getAllBalancing };