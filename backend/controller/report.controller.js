const { Op, literal, fn } = require('sequelize');
 


const getDailyReport = async (req, res) => {
    try {
        if (req.user.ispremiumuser) {
            const date = req.body.date; // Expected format: 'YYYY-MM-DD'
            const startOfDay = new Date(date);
            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(startOfDay.getDate() + 1); // Next day for the range

            // Fetch expenses for the specified date
            const data = await req.user.getExpenses({
                where: { 
                    createdAt: { 
                        [Op.gte]: startOfDay, 
                        [Op.lt]: endOfDay 
                    } 
                },
                attributes: ['name', 'amount', 'createdAt'], // Specify required fields
                raw: true,
            });

            return res.json(data);
        } else {
            return res.status(403).json({ success: false, msg: "You are not a premium user" });
        }
    } catch (error) {
        console.error('Error fetching daily report:', error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};



const getWeeklyReport = async (req, res) => {
    try {
        if (req.user.ispremiumuser) {
            const currentDate = new Date();
            const pastDate = new Date();
            pastDate.setDate(currentDate.getDate() - 30); // Look back 30 days

            // Fetch expenses within the past 30 days
            const expenses = await req.user.getExpenses({
                where: {
                    createdAt: {
                        [Op.gt]: pastDate
                    }
                },
                raw: true, // Returns plain objects
            });

            // Create a map to aggregate amounts by week
            const weeklyTotals = {};

            expenses.forEach(expense => {
                const expenseDate = new Date(expense.createdAt);
                
                // Determine the start of the week (Sunday)
                const weekStart = new Date(expenseDate);
                weekStart.setDate(expenseDate.getDate() - expenseDate.getDay());

                // Determine the end of the week (Saturday)
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);

                // Format the week range as a string
                const weekKey = `${weekStart.toISOString().split('T')[0]} - ${weekEnd.toISOString().split('T')[0]}`;

                // Initialize the week total if it doesn't exist
                if (!weeklyTotals[weekKey]) {
                    weeklyTotals[weekKey] = 0;
                }
                // Sum amounts for that week
                weeklyTotals[weekKey] += expense.amount;
            });

            // Format the result as an array
            const result = Object.entries(weeklyTotals).map(([week, totalAmount]) => ({
                week,
                totalAmount,
            }));

            return res.json(result);
        } else {
            return res.status(403).json({ success: false, msg: "You are not a premium user" });
        }
    } catch (error) {
        console.error('Error fetching weekly report:', error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};



const getMonthlyReport = async (req, res) => {
    try {
        if (req.user.ispremiumuser) {
            const month = req.body.month; // Expected format: 'YYYY-MM'
            const startDate = new Date(month + '-01'); // Start of the month
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1); // Start of the next month

            const result = await req.user.getExpenses({
                attributes: [
                    [fn('DATE', literal('createdAt')), 'date'],
                    [fn('SUM', literal('amount')), 'totalAmount']
                ],
                where: {
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lt]: endDate
                    }
                },
                group: [fn('DATE', literal('createdAt'))],
                raw: true,
            });

            return res.json(result);
        } else {
            return res.status(403).json({ success: false, msg: "You are not a premium user" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};


const getYearlyReport = async (req, res) => {
    try {
        if (req.user.ispremiumuser) {
            const year = req.body.year; // Expected format: 'YYYY'
            const startYear = new Date(year + '-01-01'); // Start of the year
            const endYear = new Date(startYear.getFullYear() + 1, 0, 1); // Start of next year

            const result = await req.user.getExpenses({
                attributes: [
                    [fn('MONTHNAME', literal('createdAt')), 'month'],
                    [fn('SUM', literal('amount')), 'totalAmount'],
                ],
                where: {
                    createdAt: {
                        [Op.gte]: startYear,
                        [Op.lt]: endYear,
                    },
                },
                group: [fn('MONTHNAME', literal('createdAt'))],
                raw: true,
            });
            return res.json(result);
        } else {
            return res.status(403).json({ success: false, msg: "You are not a premium user" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
};
 
module.exports = {
    getDailyReport,
    getMonthlyReport,
    getWeeklyReport,
    getYearlyReport
}
