const pool = require('../config/db');

// Find user by username
async function findByUsername(username) {
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );
    return result.rows[0];
}

// Find user by ID
async function findById(userId) {
    const result = await pool.query(
        'SELECT * FROM users WHERE user_id = $1',
        [userId]
    );
    return result.rows[0];
}

// Create a new user
async function createUser(fullName, username, passwordHash, role) {
    const result = await pool.query(
        `INSERT INTO users (full_name, username, password_hash, role)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [fullName, username, passwordHash, role]
    );
    return result.rows[0];
}

// Get all users
async function getAllUsers() {
    const result = await pool.query('SELECT user_id, full_name, username, role, status FROM users ORDER BY user_id');
    return result.rows;
}

module.exports = {
    findByUsername,
    findById,
    createUser,
    getAllUsers
};