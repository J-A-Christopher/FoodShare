const User = require("../models/user_model");

exports.userBoard = (req, res) => {
  res.status(200).send("You are a logged in user");
};

exports.getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = await User.findByPk(userId, {
      attributes: {
        exclude: ["password", "pushToken"],
      },
    });

    if (!userModel) {
      return res.status(404).send("User not found");
    }

    res.send({ userModel });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
