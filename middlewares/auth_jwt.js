const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const config = require('../util/auth.config');

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    console.log(token);

    if (!token) {
        return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(token, config.secret, (err, user) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized !" });
        }
        //req.userId = decoded.id;
        req.user = user;
        next();
        
    });
}

const authJwt = {
    verifyToken: verifyToken
}
module.exports = authJwt;