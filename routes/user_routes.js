const  authJwt  = require('../middlewares/auth_jwt');

const controller = require('../controllers/user_controller');
const express = require('express');
const app = express();

module.exports = function () { 
    app.use((req, res, next) =>{
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
    return app;

}