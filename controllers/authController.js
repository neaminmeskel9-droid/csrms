const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

async function showLogin(req, res) {
    res.render('auth/login', { error: null });
}

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
        console.error(err);
        res.render('auth/login', { error: 'Something went wrong. Try again.' });
    }
}

async function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

module.exports = { showLogin, login, logout };