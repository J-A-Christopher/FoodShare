const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth_routes");
const userRoutes = require("./routes/user_routes");
const sequelize = require("./util/database");
const User = require("./models/user_model");
const Food = require("./models/food_model");
const Order = require("./models/order_model");
const foodRoute = require("./routes/food_routes");
const orderRoute = require("./routes/order_routes");
const app = express();
const admin = require('firebase-admin')
const { ServiceAccount } = require('firebase-admin')
const account = require('./usiiname-push-notification-firebase-adminsdk-vkl0u-6dc35bd018.json')


admin.initializeApp({ credential: admin.credential.cert(account)})

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(authRoutes());
app.use(userRoutes());
app.use(foodRoute);
app.use(orderRoute);

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to my application" });
});
Food.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Food);
Food.belongsTo(Order, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Order);
Order.belongsTo(User);
sequelize
  .sync()
  .then((result) => {
    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
