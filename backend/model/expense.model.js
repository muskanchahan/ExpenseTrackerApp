const Sequelize = require('sequelize');
const sequelize = require('../utill/database');

const Expense = sequelize.define('Expense', {
    type: {
        type:  Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type:  Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type:  Sequelize.DATEONLY,
        allowNull: false,
    },
    amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
});

module.exports = Expense;