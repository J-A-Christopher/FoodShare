const Food = require("../models/food_model");
const { Op } = require("sequelize");
const Order = require("../models/order_model");

exports.postAddFood = (req, res, next) => {
  const imageUrl = req.body.imageUrl;
  const name = req.body.name;
  const dateOfPreparation = req.body.dateOfPreparation;
  const timeOfPreparation = req.body.timeOfPreparation;
  const timeRequiredForDelivery = req.body.timeRequiredForDelivery;
  const quantity = req.body.quantity;
  const address = req.body.address;
  const utensilsRequired = req.body.utensilsRequired;
  const status = req.body.status;
  const userId = req.user.id;
  Food.create({
    imageUrl:imageUrl,
    name: name,
    dateOfPreparation: dateOfPreparation,
    timeOfPreparation: timeOfPreparation,
    timeRequiredForDelivery:timeRequiredForDelivery,
    quantity: quantity,
    address: address,
    utensilsRequired: utensilsRequired,
    userId: userId,
    status: status,
  })
    .then((result) => {
      res.status(200).json({ message: "Food Created Successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: `${err}` });
    });
};

exports.searchFood = async (req, res, next) => {
  try {
    const { q: query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Missing search query parameter" });
    }
    const searchCriteria = {
      [Op.or]: [{ name: { [Op.like]: `%${query}%` } }],
    };

    const foods = await Food.findAll({
      where: searchCriteria,
      //include: [{ model: User, attributes: ['id', 'username'] }],
    });
    res.json({ foods });
  } catch (error) {
    console.log(`Error during search ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.liveDonations = async (req, res, next) => {
  try {
    const allFoods = await Food.findAll({ where: { status: "unprocessed" } });
    res.json({ allFoods });
  } catch (error) {
    console.log(`Error getting food ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.userDonations = async (req, res, next) => {
  const userId = req.user.id;
  const newDataStructure = [];
  try {
    const foods = await Food.findAll({ where: { userId: userId } });
    for (const food of foods) {
      var foodId = food.id;
      var retrievedFoodOrder = await Order.findOne({ where: { foodId: foodId, status: 'approved' } });
      if (retrievedFoodOrder) {
        // Push both the food and order objects into the newDataStructure array
        newDataStructure.push({ food: food, order: retrievedFoodOrder });
      }
      //newDataStructure.push({food:food,order: retrievedFoodOrder });
      
    }
    // const orders = await Order.findAll({ where: { userId: userId } });
    // for (const order of orders) {
    //   var foodId = order.foodId;
    //   var retrievedFood = await Food.findOne({ where: { id: foodId } });
    //   newDataStructure.push({ order, food: retrievedFood });
    // }

    res.json({newDataStructure});
  } catch (error) {
    console.log(`Error getting food ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
