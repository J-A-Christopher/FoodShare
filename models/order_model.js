const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  foodId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  recipeintId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  status: {
    type: Sequelize.STRING,
    defaultValue:'requested',
    allowNull: false,
  }



  
});

module.exports = Order;
