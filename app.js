const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const procurementRoutes = require('./routes/procurementRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const salesRoutes = require('./routes/salesRoutes');
const cashierRoutes = require('./routes/cashierRoutes');
const reportRoutes = require('./routes/reportRoutes');
const agentRoutes = require('./routes/agent'); 

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));

// Routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', categoryRoutes);
app.use('/', productRoutes);
app.use('/', procurementRoutes);
app.use('/', inventoryRoutes);
app.use('/', salesRoutes);
app.use('/', cashierRoutes);
app.use('/', reportRoutes);   
app.use('/agent', agentRoutes); 

// Home redirect
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CSRMS server running on http://localhost:${PORT}`);
});