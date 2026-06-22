const bcrypt = require('bcrypt');
const pool = require('./config/db');

async function seedUsers() {
    try {
        const users = [
            { fullName: 'Crown Director', username: 'director1', password: 'director123', role: 'director' },
            { fullName: 'Branch Manager', username: 'manager1', password: 'manager123', role: 'manager' },
            { fullName: 'Sales Agent', username: 'agent1', password: 'agent123', role: 'sales_agent' }
        ];

        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await pool.query(
                `INSERT INTO users (full_name, username, password_hash, role)
                 VALUES ($1, $2, $3, $4)`,
                [user.fullName, user.username, hashedPassword, user.role]
            );
            console.log(`Created user: ${user.username} (${user.role})`);
        }

        console.log('Seeding complete!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seedUsers();