const Sequelize = require('sequelize');
const sequelize = require('../utill/database');

const User = sequelize.define('User', {
    username: {
        type:  Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ispremiumuser:{
      type:Sequelize.BOOLEAN,
    },
    totalExpenses: {
        type: Sequelize.INTEGER,
        default: 0,
      }
});

module.exports = User;
