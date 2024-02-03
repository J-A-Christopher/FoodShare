const Food = require("../models/food_model");
const { Op } = require('sequelize');


exports.postAddFood = (req, res, next) => {
  const name = req.body.name;
  const quantity = req.body.quantity;
  const timeCooked = req.body.timeCooked;
  const address = req.body.address;
  const utensilsRequired = req.body.utensilsRequired;
  const status = req.body.status
  const userId = req.user.id;
  Food.create({
    name: name,
    quantity: quantity,
    timeCooked: timeCooked,
    address: address,
    utensilsRequired: utensilsRequired,
    userId: userId,
    status: status
  })
    .then((result) => {
      res.status(200).json({message: "Food Created Successfully"});
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({message: `${err}`});

    });
};

exports.searchFood = async (req, res, next) => {
  try {
    const { q: query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Missing search query parameter' });
    }
    const searchCriteria = {
      [Op.or]: [
        { name: { [Op.like]: `%${query}%` } },
      ],
  
    }
  
    const foods = await Food.findAll({
      where: searchCriteria,
      //include: [{ model: User, attributes: ['id', 'username'] }],
    });
    res.json({ foods });
  } catch (error) {
    console.log(`Error during search ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
    
  }
 
  
}