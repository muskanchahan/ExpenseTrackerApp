const Expense = require('../model/expense.model');
const User = require('../model/user.model');
const sequelize = require('../utill/database');

// Get all expenses for a user with pagination
// In expense.controller.js
const jwt = require('jsonwebtoken'); // Ensure you have this package installed

 
const getExpense = async (req, res) => {
    try {
        // Assuming the JWT is sent in the Authorization header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify and decode the token to get the user ID
        const decoded = jwt.verify(token, 'yourSecretKey'); // Replace with your actual secret key
        const userId = decoded.id; // Adjust according to your token payload structure

        const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified
        const offset = (page - 1) * limit;

        // Fetch expenses from the database for the logged-in user, implementing pagination
        const { count, rows } = await Expense.findAndCountAll({
            where: { userId: userId }, // Only fetch expenses for the logged-in user
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']] // Order by creation date, newest first
        });

        res.json({ expenses: rows, totalItems: count, totalPages: Math.ceil(count / limit), currentPage: page });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses' });
    }
};

 


// Post a new expense and update total expenses
const postExpense = async (req, res) => {
    try {
        const { type, name, date, amount } = req.body;
        const userId = req.userId; // Retrieved from middleware
        
        // Create the new expense
        const newExpense = await Expense.create({ type, name, date, amount, UserId: userId });

        // Update the user's total expenses
        const user = await User.findByPk(userId);
        if (user) {
            user.totalExpenses += amount; // Increment total expenses
            await user.save(); // Save the updated user record
        }

        return res.status(201).json(newExpense); 
    } catch (error) {
        return res.status(500).json({ message: 'Error in posting the expense', error });
    }
};

// Delete an expense and update total expenses
const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.userId; // Retrieved from middleware

        const expense = await Expense.findOne({ where: { id: expenseId, UserId: userId } });

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found or not authorized' });
        }

        // Update the user's total expenses
        const user = await User.findByPk(userId);
        if (user) {
            user.totalExpenses -= expense.amount; // Decrement total expenses
            await user.save(); // Save the updated user record
        }

        await expense.destroy(); // Delete the expense
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the expense' });
    }
};

// Update an expense and manage total expenses
const updateExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const { name, date, amount, type } = req.body;
        const userId = req.userId; // Retrieved from middleware

        const expense = await Expense.findOne({ where: { id: expenseId, UserId: userId } });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or not authorized' });
        }

        // Calculate the difference in amount for total expenses adjustment
        const amountDifference = (amount || expense.amount) - expense.amount;

        // Update the expense fields
        expense.name = name || expense.name;
        expense.date = date || expense.date;
        expense.amount = amount || expense.amount;
        expense.type = type || expense.type;

        await expense.save(); // Save the updated expense

        // Update the user's total expenses
        const user = await User.findByPk(userId);
        if (user) {
            user.totalExpenses += amountDifference; // Adjust total expenses
            await user.save(); // Save the updated user record
        }

        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getExpense,
    postExpense,
    deleteExpense,
    updateExpense,
};
