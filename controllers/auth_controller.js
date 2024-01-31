const User = require('../models/user_model');

const config = require('../util/auth.config');

var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

exports.signUp = (req, res) => {
    User.create({
        firstname: req.body.firstname,
        lastname:req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        pushToken: req.body.pushToken,
        phoneNumber: req.body.phoneNumber,
        donationType: req.body.donationType

    }).then(user => {
        res.status(200).send({ message: "User created Successfully" , userData:user});
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
}

exports.signIn = (req, res) => {
    User.findOne({
        where:{username: req.body.username}
    }).then(user => {
        if (!user) {
            return res.status(404).send({message: 'User not found. Please Sign Up first'})
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password"
            })
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400
            
        });
        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: token
        })
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
}

