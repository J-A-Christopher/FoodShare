const User = require('../models/user_model');

///Checking DuplicateUsername or Email During SignUp
const checkDuplicateUsernameOrEmail = (req, res, next) => {
    //Username
    User.findOne({ where: { username: req.body.username } }).then(user => {
        if (user) {
            res.status(400).json({ message: 'Failed! Username is already in use!' });
            return;
        }
    });

    //Email
    User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
            res.status(400).json({ message: 'Failed! Email is already in use!' });
            return;
        }
        next();
    });
}



 module.exports = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};;