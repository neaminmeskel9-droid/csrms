// Replace your existing redirect block with this:

// 1. Uniform the role to what your frontend routes expect
let userRole = user.role;
if (userRole === 'sales_agent') {
    userRole = 'agent'; // Forces 'sales_agent' to match an 'agent' route/middleware
}

// 2. Save user info in session using the normalized role
req.session.user = {
    id: user.user_id,
    fullName: user.full_name,
    username: user.username,
    role: userRole // Now matches your route checks
};

// 3. Redirect smoothly
if (userRole === 'director') {
    res.redirect('/director/dashboard');
} else if (userRole === 'manager') {
    res.redirect('/manager/dashboard');
} else {
    res.redirect('/agent/dashboard');
}