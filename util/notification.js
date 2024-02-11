const { messaging } = require("firebase-admin");
exports.sendPushNOtification = async (pushToken, title, body) => {
  console.log(body)
  try {
    const message = {
      data: body,
      notification: {
        title,
      },
      token: pushToken,
    };

    const response = await messaging().send(message);
    console.log(response);
  } catch (error) {
    console.log(error);
    throw new Error("Error sending push notification");
  }
};
