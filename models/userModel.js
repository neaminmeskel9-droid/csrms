const db = require('../config/db'); // Points to your database connection pool

async function findByUsername(username) {
    // We select ALL necessary columns and filter ONLY by username and active status
    const query = `
        SELECT user_id, username, password_hash, role, full_name, status 
        FROM users 
        WHERE LOWER(username) = LOWER($1) AND status = 'active';
    `;
    
    try {
        const res = await db.query(query, [username]);
        if (res.rows.length > 0) {
            return res.rows[0]; // Returns the user object to authcontroller.js
        }
        return null;
    } catch (err) {
        console.error('Database error inside findByUsername:', err);
        throw err;
    }
}

module.exports = {
    findByUsername
};