const Food = require("../models/food_model");
const Order = require("../models/order_model");
const { sendPushNOtification } = require("../util/notification");

const User = require("../models/user_model");

exports.orderController = async (req, res, next) => {
  const userId = req.user.id;
  const foodId = req.body.foodId;

  try {
    const food = await Food.findByPk(foodId);

    if (!food) {
      return res.status(404).json({ message: "No food found" });
    }

    if (food.userId === userId) {
      return res
        .status(403)
        .json({ message: "You cannot order the food you created." });
    }

    if (food.status === "processed") {
      return res.json({ message: "Food already booked!" });
    }

    const orderExists = await Order.findOne({
      where: { foodId: food.id },
    });

    if (orderExists) {
      console.log("Order already created for this food.");
      return res.json({
        message: "Food successfully processed, and order already created!",
      });
    }

    const order = await Order.create({
      foodId,
      recipeintId: food.userId,
      senderId: userId,
      userId: userId,
    });
    const foodObject = await Food.findByPk(foodId);
    const orderId = order.id;
    const sender = await User.findByPk(order.userId);
    const userFound = await User.findByPk(order.recipeintId);
    const pushTokenForRecepient = userFound.pushToken;

    const data = {
      foodName: foodObject.name,
      imageUrl: foodObject.imageUrl,
      orderId: `${orderId}`,
      name: sender.firstname,
    };

    await food.update({ orderId: order.id, status: "processed" });
    await sendPushNOtification(
      pushTokenForRecepient,
      "You have a new order request",
      data
    );

    res.json({ message: "Food successfully processed, and order created!" });
  } catch (error) {
    console.error("Error processing food and creating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.processOrder = async (req, res, next) => {
  const userId = req.user.id;
  const status = req.body.status;
  const orderId = req.body.orderId;
  const orderModel = await Order.findByPk(orderId);

  console.log(req.body)
  if (!orderModel) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (orderModel.recipeintId !== userId) {
    return res.status(401).json({ message: "UnAuthorized" });
  }

  if (orderModel.status !== "requested") {
    return res
      .status(422)
      .json({ message: "This order has already been processed" });
  }

  const data = {
    order: orderModel.status,
  };
  if (status === "approved") {
    orderModel.status = status;
    await orderModel.update({ status });

    ///Todo SEnd Push Notification(Order Accepted)
    const user = await User.findByPk(userId);
    const pushTokenForUser = user.pushToken;
    const orderRecipientId = orderModel.userId;
    const orderRecipient = await User.findByPk(orderRecipientId);
    const pushTokenForRecipient = orderRecipient.pushToken;

    await sendPushNOtification(
      pushTokenForRecipient,
      "Order approved; You can now pick up your order.",
      data
    );

    return res.status(201).json({ message: "Order approved; You can now pick up your order." });
  }

  if (status === "rejected") {
    await orderModel.update({ status });
    const foodId = orderModel.foodId;
    const foodModel = await Food.findByPk(foodId);
    const foodStatus = (foodModel.status = "unprocessed");
    await foodModel.update({ status: foodStatus });

    ///Todo Send Push Notification (Order rejected)
    const orderRecipientId = orderModel.userId;
    const orderRecipient = await User.findByPk(orderRecipientId);
    const pushTokenForRecipient = orderRecipient.pushToken;

    await sendPushNOtification(
      pushTokenForRecipient,
      "Order rejected.",
      data
    );

    return res.status(200).json({ message: "Order rejected" });
  }
  return res.status(404).json({ message: "Bad Request" });
};
