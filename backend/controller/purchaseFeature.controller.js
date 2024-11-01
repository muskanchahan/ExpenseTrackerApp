const User = require('../model/user.model');
const sequelize = require('sequelize');
const Expense = require('../model/expense.model');

// const purchasePremiumFeature = async (req, res) => {
//     try {
//         // Fetch all users and their total expense sums
//         const leaderboardData = await User.findAll({
//             include: [{
//                 model: Expense,
//                 attributes: []  // No need to retrieve individual expense rows
//             }],
//             attributes: [
//                 'id', 'username',
//                 [sequelize.fn('SUM', sequelize.col('Expenses.amount')), 'totalExpense']
//             ],
//             group: ['id'],
//             order: [[sequelize.literal('totalExpense'), 'DESC']] // Order by total expense descending
//         });

//         // Format the data for easier consumption in the frontend
//         const formattedData = leaderboardData.map(user => ({
//             id: user.id,
//             username: user.username,
//             totalExpense: user.getDataValue('totalExpense') || 0 // This will get the calculated field; default to 0 if null
//         }));

//         // Update each user's total expense in the User table
//         await Promise.all(formattedData.map(async (user) => {
//             await User.update(
//                 { totalExpense: user.totalExpense }, // Set the new total expense
//                 { where: { id: user.id } } // Update the user with the specific ID
//             );
//         }));

//         // Send the response back to the client
//         res.status(200).json(formattedData);
//     } catch (error) {
//         console.log('Error fetching leaderboard data:', error);
//         res.status(500).json({ error: 'Failed to fetch leaderboard data' });
//     }
// };

// module.exports = { purchasePremiumFeature };


const purchasePremiumFeature = async (req, res) => {
    try {
        // Fetch all users and their total expenses directly from the User table
        const leaderboardData = await User.findAll({
            attributes: ['id', 'username', 'totalExpenses'],
            order: [['totalExpenses', 'DESC']] // Order by totalExpenses descending
        });

        // Format the data for easier consumption in the frontend
        const formattedData = leaderboardData.map(user => ({
            id: user.id,
            username: user.username,
            totalExpense: user.totalExpenses || 0 // Default to 0 if null
        }));

        // Send the response back to the client
        res.status(200).json(formattedData);
    } catch (error) {
        console.log('Error fetching leaderboard data:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
};

module.exports = { purchasePremiumFeature };
