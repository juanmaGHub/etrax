const express = require('express');
const router = express.Router();

// Import routes
const usersRoutes = require('./userRoutes');
const categoriesRoutes = require('./categoryRoutes');
const expensesRoutes = require('./expenseRoutes');

// Use routes
//router.use('/api/users', usersRoutes);
router.use('/api', usersRoutes);
router.use('/api/categories', categoriesRoutes);
router.use('/api/expenses', expensesRoutes);

module.exports = router;