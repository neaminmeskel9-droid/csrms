const pool = require('../config/db');

async function getAllProducts() {
    const result = await pool.query(
        `SELECT p.*, c.category_name 
         FROM products p
         JOIN categories c ON p.category_id = c.category_id
         ORDER BY p.product_id`
    );
    return result.rows;
}

async function getProductById(id) {
    const result = await pool.query(
        `SELECT p.*, c.category_name 
         FROM products p
         JOIN categories c ON p.category_id = c.category_id
         WHERE p.product_id = $1`,
        [id]
    );
    return result.rows[0];
}

async function createProduct(categoryId, name, barcode, description, costPrice, sellingPrice, reorderLevel) {
    const result = await pool.query(
        `INSERT INTO products (category_id, product_name, barcode, description, cost_price, selling_price, reorder_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [categoryId, name, barcode, description, costPrice, sellingPrice, reorderLevel]
    );
    return result.rows[0];
}

async function updateProduct(id, categoryId, name, barcode, description, costPrice, sellingPrice, reorderLevel) {
    const result = await pool.query(
        `UPDATE products SET category_id=$1, product_name=$2, barcode=$3, 
         description=$4, cost_price=$5, selling_price=$6, reorder_level=$7
         WHERE product_id=$8 RETURNING *`,
        [categoryId, name, barcode, description, costPrice, sellingPrice, reorderLevel, id]
    );
    return result.rows[0];
}

async function toggleProductStatus(id, status) {
    const result = await pool.query(
        `UPDATE products SET status=$1 WHERE product_id=$2 RETURNING *`,
        [status, id]
    );
    return result.rows[0];
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, toggleProductStatus };