const Sequelize=require('sequelize');
const sequelize=new Sequelize('expenses_db1','root','muskan!!!@00$',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;