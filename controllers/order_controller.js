const Food = require('../models/food_model');
const Order = require('../models/order_model')

exports.orderController = async (req, res, next) => {
  const userId = req.user.id;
  const foodId = req.body.foodId;

  try {
    const food = await Food.findByPk(foodId);

    if (!food) {
      return res.status(404).send('No food found');
    }

    if (food.userId === userId) {
      return res.status(403).send('You cannot order the food you created.');
    }

    if (food.status === 'processed') {
      return res.send('Food already booked!');
    }

    const orderExists = await Order.findOne({
      where: { foodId: food.id },
    });

    if (orderExists) {
      console.log('Order already created for this food.');
      return res.send('Food successfully processed, and order already created!');
    }

    
    const order = await Order.create({
      foodId,
      recipeintId: food.userId,
      senderId: userId,
      userId: userId, 
    });

    await food.update({ orderId: order.id, status: 'processed' });

    res.send('Food successfully processed, and order created!');
  } catch (error) {
    console.error('Error processing food and creating order:', error);
    res.status(500).send('Internal Server Error');
  }
};
