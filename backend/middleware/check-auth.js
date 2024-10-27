const jwt = require("jsonwebtoken");
const { decode } = require("punycode");



module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization;
        console.log(token);
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {email : decodedToken.email, userId : decodedToken.userId};
        next();
    }   
    catch(err){
        res.status(401).json({
            message: "You are not authenticated!"
        })
    } 
}