const pool = require('../config/db');

// Get all categories
async function getAllCategories() {
    const result = await pool.query(
        'SELECT * FROM categories ORDER BY category_id'
    );
    return result.rows;
}

// Get single category by ID
async function getCategoryById(id) {
    const result = await pool.query(
        'SELECT * FROM categories WHERE category_id = $1',
        [id]
    );
    return result.rows[0];
}

// Create category
async function createCategory(name, description) {
    const result = await pool.query(
        `INSERT INTO categories (category_name, description)
         VALUES ($1, $2) RETURNING *`,
        [name, description]
    );
    return result.rows[0];
}

// Update category
async function updateCategory(id, name, description) {
    const result = await pool.query(
        `UPDATE categories SET category_name = $1, description = $2
         WHERE category_id = $3 RETURNING *`,
        [name, description, id]
    );
    return result.rows[0];
}

// Toggle category status
async function toggleCategoryStatus(id, status) {
    const result = await pool.query(
        `UPDATE categories SET status = $1
         WHERE category_id = $2 RETURNING *`,
        [status, id]
    );
    return result.rows[0];
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    toggleCategoryStatus
};