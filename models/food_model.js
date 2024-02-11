const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Food = sequelize.define('food', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    imageUrl: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    dateOfPreparation: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    timeOfPreparation: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    timeRequiredForDelivery: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    utensilsRequired: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'unprocessed',
        allowNull: false,
    },
    
});

module.exports = Food;
