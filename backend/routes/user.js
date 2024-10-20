const express = require('express');
const User = require('./../models/user');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post('/signup',(req,res,next) => {
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
                error: error
            })
        })
    });
    
});

router.post('/login',(req,res,next) => {
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
        return bcrypt.compare(req.body.password,user.password);
    })
    .then( result => {
        console.log(result);
        if(!result){
            return res.status(401).json({
                message: "Auth Failed 2nd then block"
            });
        }
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},'secret_should_be_longer_than_expected', {
            expiresIn: '1h'
        });
        return res.status(200).json({
            message: "Login successful",
            token : token,
            expiresIn: 3600
        })
    })
    .catch( err => {
        console.log(err);
        return res.status(401).json({
            message: "Auth Failed catch block"
        });
    })
});

module.exports = router;