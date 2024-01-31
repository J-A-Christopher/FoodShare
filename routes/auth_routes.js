const verifySignUp = require("../middlewares/verify_signup");
const express = require("express");
const app = express();

const controller = require("../controllers/auth_controller");

module.exports = function () {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signUp
  );

  app.post("/api/auth/signin", controller.signIn);

  return app;
};
