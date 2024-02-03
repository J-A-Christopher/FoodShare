const User = require("../models/user_model");

exports.userBoard = (req, res) => {
  res.status(200).json({ message:"You are a logged in user"});
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

    res.json({ userModel });
  } catch (error) {
    res.status(500).json({message: "Internal server error"});
  }
};
