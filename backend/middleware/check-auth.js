const jwt = require("jsonwebtoken");



module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization;
        console.log(token);
        jwt.verify(token,"secret_should_be_longer_than_expected");
        next();
    }   
    catch(err){
        res.status(401).json({
            message: "Auth failed due to either the absence of token in the header or presence of an invalid token"
        })
    } 
}