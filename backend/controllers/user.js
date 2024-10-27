const User = require('./../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.createUser = (req,res,next) => {
    bcrypt.hash(req.body.password, 10).then( hash => {
        const user = new User({
            email: req.body.email,
            password : hash
        });

        user.save()
        .then(result => {
            res.status(201).json({
                message: "User created successfully",
                result : result
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'You already have an account, kindly login.'
            })
        })
    });
}

exports.userLogin = (req,res,next) => {
    let fetchedUser;
    User.findOne({email : req.body.email})
    .then( user => {
        console.log(user);
        if(!user){
            return res.status(401).json({
                message: "Auth Failed 1st then block"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then( result => {
        console.log(result);
        if(!result){
            return res.status(401).json({
                message: "Auth Failed 2nd then block"
            });
        }
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
            process.env.JWT_KEY,
            {
                expiresIn: '1h'
        });
        return res.status(200).json({
            message: "Login successful",
            token : token,
            expiresIn: 3600,
            userId: fetchedUser._id
        })
    })
    .catch( err => {
        console.log(err);
        return res.status(401).json({
            message: "Invalid authentication credentials!"
        });
    })
}