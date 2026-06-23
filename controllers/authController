const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// Show login page
function showLogin(req, res) {
    res.render('auth/login', { error: null });
}

// Handle login
async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await userModel.findByUsername(username);

        if (!user) {
            return res.render('auth/login', { error: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.render('auth/login', { error: 'Invalid username or password' });
        }

        // Save user info in session
        req.session.user = {
            id: user.user_id,
            fullName: user.full_name,
            username: user.username,
            role: user.role
        };

        // Redirect based on role
        if (user.role === 'director') {
            res.redirect('/director/dashboard');
        } else if (user.role === 'manager') {
            res.redirect('/manager/dashboard');
        } else {
            res.redirect('/agent/dashboard');
        }

    } catch (err) {
        console.error(err);
        res.render('auth/login', { error: 'Something went wrong. Try again.' });
    }
}

// Handle logout
function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

module.exports = { showLogin, login, logout };