const { initializeApp, applicationDefault } = require("firebase-admin/app");
const Food = require("../models/food_model");
const Order = require("../models/order_model");

const admin = require("firebase-admin");
const serviceAccount = require("../usiiname-push-notification-firebase-adminsdk-vkl0u-6dc35bd018.json");
const User = require("../models/user_model");

process.env.GOOGLE_APPLICATION_CREDENTIALS;

initializeApp({
  projectId: "usiiname-push-notification",
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://usiiname-push-notification.firebaseio.com",
});

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

    await food.update({ orderId: order.id, status: "processed" });

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

  if (status === "approved") {
    orderModel.status = status;
    await orderModel.update({ status });

    ///Todo SEnd Push Notification(Order Accepted)
    const user = await User.findByPk(userId);
    const pushTokenforUser = user.pushToken;
    const registrationToken = pushTokenforUser;
    const message = {
      notification: {
        title: "Order Acception",
        body: "Congratulations !.. your order has been accepted.",
      },
      token: registrationToken,
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        // res.status(200).json({
        //   message: "Successfully sent message",
        //   token: registrationToken
        // });
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        // res.status(400).json({message: "Error sending message ", error})
        console.log("Error sending message:", error);
      });

    return res.status(201).json({ message: "Order successfully processed" });
  }

  if (status === "rejected") {
    await orderModel.update({ status });
    const foodId = orderModel.foodId;
    const foodModel = await Food.findByPk(foodId);
    const foodStatus = (foodModel.status = "unprocessed");
    await foodModel.update({ status: foodStatus });

    ///Todo Send Push Notification (Order rejected)
    const user = await User.findByPk(userId);
    const pushTokenforUser = user.pushToken;

    await sendPushNotification(
      pushTokenforUser,
      "Order rejected.",
      "Try again next time"
    );

    return res.status(200).json({ message: "Order rejected" });
  }
};
