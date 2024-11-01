const express = require('express');
const userauthentication = require('../middleware/auth'); // Ensure you import the authentication middleware correctly
const expenseController = require('../controller/expense.controller'); // Ensure you import the controller correctly

const route = express.Router();

// Define your routes, ensuring the functions are defined correctly
route.post('/ExpenseTracker',userauthentication.authenticate, expenseController.postExpense);
route.get('/ExpenseTracker',userauthentication.authenticate, expenseController.getExpense);
route.delete('/ExpenseTracker/:id',userauthentication.authenticate, expenseController.deleteExpense);
route.put('/ExpenseTracker/:id',userauthentication.authenticate, expenseController.updateExpense);
// route.get('/download',userauthentication.authenticate,expenseController.downloadExpenses)
module.exports = route;
