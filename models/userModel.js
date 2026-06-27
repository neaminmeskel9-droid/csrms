const db = require('../config/db'); // Adjust this path to match your actual database configuration file

async function findByUsername(username) {
    const query = `
        SELECT 
            user_id, 
            username, 
            password_hash, 
            role, 
            full_name, 
            status 
        FROM users 
        WHERE LOWER(username) = LOWER($1) AND status = 'active';
    `;
    
    try {
        const res = await db.query(query, [username]);
        if (res.rows.length > 0) {
            return res.rows[0];
        }
        return null;
    } catch (err) {
        console.error('Database error in findByUsername:', err);
        throw err;
    }
}

module.exports = {
    findByUsername
};