// Check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// Check if user is director
function isDirector(req, res, next) {
    if (req.session.user && req.session.user.role === 'director') {
        return next();
    }
    res.redirect('/login');
}

// Check if user is manager
function isManager(req, res, next) {
    if (req.session.user && req.session.user.role === 'manager') {
        return next();
    }
    res.redirect('/login');
}

// Check if user is sales agent
function isSalesAgent(req, res, next) {
    if (req.session.user && req.session.user.role === 'sales_agent') {
        return next();
    }
    res.redirect('/login');
}

module.exports = { isAuthenticated, isDirector, isManager, isSalesAgent };