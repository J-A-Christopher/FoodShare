const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const config = require('../util/auth.config');

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    console.log(token);

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    jwt.verify(token, config.secret, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized !" });
        }
        req.user = decodedToken.user;
        next();
        
    });
}

const authJwt = {
    verifyToken: verifyToken
}
module.exports = authJwt;