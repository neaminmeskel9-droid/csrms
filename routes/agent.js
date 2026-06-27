const express = require('express');
const router = express.Router();

// Agent Dashboard
router.get('/dashboard', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'agent') {
        return res.redirect('/login');
    }

    res.send('Agent Dashboard is working ✅');
});

module.exports = router;