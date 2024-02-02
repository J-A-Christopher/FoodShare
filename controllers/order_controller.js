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

exports.processOrder = async (req, res, next) => {
  const userId = req.user.id;
  const status = req.body.status;
  const orderId = req.body.orderId;
  const orderModel = await Order.findByPk(orderId);
  if (!orderModel) {
   return res.status(404).json({ message: 'Order not found' });
  }

  if (orderModel.recipeintId !== userId) {
   return res.status(401).json({ message: 'UnAuthorized' });
  }
  
  if (orderModel.status !== 'requested') {
   return res.status(422).json({ message: "This order has already been processed" });
  }

  if (status === "approved") {
    orderModel.status = status;
    await orderModel.update({ status });
    
    ///Todo SEnd Push Notification(Order Accepted)

    return res.status(201).json({ message: 'Order successfully processed' });

  }

  if (status === "rejected") {
    await orderModel.update({ status });
    const foodId = orderModel.foodId;
    const foodModel = await Food.findByPk(foodId);
    const foodStatus = foodModel.status = 'unprocessed';
    await foodModel.update({ status: foodStatus });

    ///Todo Send Push Notification (Order rejected)

    return res.status(200).json({ message: 'Order rejected' });
    
  }
  
}
