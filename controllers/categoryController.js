const categoryModel = require('../models/categoryModel');

// View all categories
async function listCategories(req, res) {
    try {
        const categories = await categoryModel.getAllCategories();
        res.render('manager/categories/index', { 
            categories, 
            user: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading categories');
    }
}

// Show create form
function showCreateForm(req, res) {
    res.render('manager/categories/create', { 
        user: req.session.user,
        error: null 
    });
}

// Handle create
async function createCategory(req, res) {
    const { category_name, description } = req.body;
    try {
        await categoryModel.createCategory(category_name, description);
        res.redirect('/manager/categories');
    } catch (err) {
        console.error(err);
        res.render('manager/categories/create', { 
            user: req.session.user,
            error: 'Category name already exists' 
        });
    }
}

// Show edit form
async function showEditForm(req, res) {
    try {
        const category = await categoryModel.getCategoryById(req.params.id);
        res.render('manager/categories/edit', { 
            category, 
            user: req.session.user,
            error: null 
        });
    } catch (err) {
        console.error(err);
        res.redirect('/manager/categories');
    }
}

// Handle edit
async function updateCategory(req, res) {
    const { category_name, description } = req.body;
    try {
        await categoryModel.updateCategory(req.params.id, category_name, description);
        res.redirect('/manager/categories');
    } catch (err) {
        console.error(err);
        res.redirect('/manager/categories');
    }
}

// Toggle status
async function toggleStatus(req, res) {
    try {
        const category = await categoryModel.getCategoryById(req.params.id);
        const newStatus = category.status === 'active' ? 'inactive' : 'active';
        await categoryModel.toggleCategoryStatus(req.params.id, newStatus);
        res.redirect('/manager/categories');
    } catch (err) {
        console.error(err);
        res.redirect('/manager/categories');
    }
}

module.exports = { 
    listCategories, 
    showCreateForm, 
    createCategory, 
    showEditForm, 
    updateCategory, 
    toggleStatus 
};