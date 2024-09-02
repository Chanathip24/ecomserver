const {body, check} = require('express-validator')
const jwt = require('jsonwebtoken')

const registervalidator = [
    body('email').isLength({min:1}).isEmail().trim().escape().withMessage("Email error")
]

const checkauthadmin = (req, res, next) => {
    
    const token = req.cookies['token'];
    if(!token) return res.status(401).json({msg: "No token "});

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err) return res.status(401).json({msg : "Unauthorized token error"})
        if(decoded.role !== "ADMIN") return res.status(401).json({msg : "You are not an admin"})
        req.user = decoded
        next()
    })

};

module.exports = [checkauthadmin,registervalidator];
