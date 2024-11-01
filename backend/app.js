const express = require('express');
const path = require('path');
const sequelize = require('./utill/database');
const cors = require('cors');
const app = express();
const dotenv=require('dotenv');

// Middleware for CORS and parsing JSON and URL-encoded data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import user and expense routes
const userRoute = require('./route/user.route');
const expenseRoutes = require('./route/expense.route'); // Add this line
const purchaseRoutes=require('./route/purchase.route');
const purchaseFeatureRoute=require('./route/purchaseFeature.route');
const forgetPasswordRoute=require('./route/forgetpassword.route');
const reportRoute=require('./route/report.route')
const User = require('./model/user.model');
const Expense=require('./model/expense.model');
const Order = require('./model/order.model');
const forgetPassword=require('./model/forgetpassword.model');
// const Download=require('./model/download.model');

// Use the routes
app.use('/api', userRoute);
app.use('/api', expenseRoutes); // Add this line
app.use('/api', purchaseRoutes);
app.use('/api',purchaseFeatureRoute);
app.use('/', forgetPasswordRoute);
app.use('/report',reportRoute);
// Serve static files but do not serve index.html by default
app.use(express.static(path.join(__dirname, '..', 'frontend'), {
  index: false
}));

// Routes for serving signup and login HTML files
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.get('/ExpenseTracker', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'expense.html'));
});


app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname,'..','frontend', 'leaderboard.html'));
});
// Set up the relationships between models
User.hasMany(Expense);
Expense.belongsTo(User);


User.hasMany(Order);
Order.belongsTo(User);


User.hasMany(forgetPassword);
 forgetPassword.belongsTo(User);


// Sync the database and start the server
sequelize
  .sync({alter:true})
  .then(() => {
    console.log('Database synced successfully');
    app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
  })
  .catch(err => console.error('Error syncing database:', err));

