const express = require('express');
const router = express.Router();

// Placeholder to prevent app.js from crashing
router.get('/sales-status', (req, res) => {
    res.send('Sales system online.');
});

module.exports = router;