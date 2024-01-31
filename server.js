const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/auth_routes');
const userRoutes = require('./routes/user_routes');
const sequelize = require('./util/database');
const User = require('./models/user_model')
const Food = require('./models/food_model');
const foodRoute = require('./routes/food_routes');
const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(authRoutes());
app.use(userRoutes());
app.use(foodRoute);

app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to my application" });
});
Food.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Food);
sequelize.sync().then(result => {
  const PORT = process.env.PORT || 8081;
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
  
}).catch(err => {
  console.log(err);
})


