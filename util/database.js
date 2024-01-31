const Sequelize = require('sequelize');

const sequelize = new Sequelize('foodshare', 'root', '37936845', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;