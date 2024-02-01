const Food = require("../models/food_model");

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
      res.status(200).send("Food Created Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
