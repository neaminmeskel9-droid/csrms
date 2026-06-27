const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

async function showLogin(req, res) {
    res.render('auth/login', { error: null });
}

async function login(req, res) {
    // 1. Trim invisible spaces from inputs
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';

    console.log(`=== 🔍 DEBUG START FOR USER: "${username}" ===`);

    try {
        // 2. Query the database
        const user = await userModel.findByUsername(username);
        console.log("1. Database Query Result:", user);

        if (!user) {
            console.log(`❌ FAIL: Username "${username}" yielded no results in the database.`);
            return res.render('auth/login', { error: 'Invalid username or password' });
        }

        // 3. Test Bcrypt Compare
        console.log("2. Comparing provided password with database hash...");
        const match = await bcrypt.compare(password, user.password_hash);
        console.log(`3. Bcrypt Match Result: ${match}`);

        if (!match) {
            console.log(`❌ FAIL: Password did not match the hash for "${username}".`);
            return res.render('auth/login', { error: 'Invalid username or password' });
        }

        // 4. Session Regeneration & Routing
        console.log("4. Password verified! Regenerating session...");
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regeneration error:', err);
                return res.status(500).send('Session error');
            }

            let userRole = user.role;
            if (userRole === 'sales_agent') {
                userRole = 'agent';
            }

            req.session.user = {
                id: user.user_id,
                fullName: user.full_name || user.username,
                username: user.username,
                role: userRole,
                originalRole: user.role
            };

            console.log(`🎯 SUCCESS: Redirecting ${username} to /${userRole}/dashboard`);
            
            if (userRole === 'director') {
                return res.redirect('/director/dashboard');
            } else if (userRole === 'manager') {
                return res.redirect('/manager/dashboard');
            } else if (userRole === 'agent') {
                return res.redirect('/agent/dashboard');
            } else {
                return res.redirect('/login');
            }
        });

    } catch (err) {
        console.error("💥 SYSTEM ERROR DURING LOGIN:", err);
        res.render('auth/login', { error: 'Something went wrong. Try again.' });
    }
}

async function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

module.exports = { showLogin, login, logout };