const { body, check } = require("express-validator");
const jwt = require("jsonwebtoken");

const registervalidator = [
  body("email").isLength({ min: 1 }).isEmail().trim().escape().withMessage("This is not an email please try again."),
  body('fname').isLength({min : 1}).trim().escape().withMessage("Lastname is empty."),
  body('lname').isLength({min: 1}).trim().escape().withMessage("Lastname is empty."),
  body('password').isLength({min:5}).withMessage("Password must contain at least 5 characters.")
    
];
const loginvalidator = [
    body("email").isLength({ min: 1 }).isEmail().trim().escape().withMessage("This is not an email please try again."),
    body('password').isLength({min:5}).withMessage("Password must contain at least 5 characters.")
      
  ];

const checkauthadmin = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ msg: "No token " });
  const realToken = token.split(" ")[1];
    
  jwt.verify(realToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Unauthorized token error" });
    if (decoded.role !== "ADMIN")
      return res.status(401).json({ msg: "You are not an admin" });
    req.user = decoded;
    next();
  });
};

module.exports = {checkauthadmin,registervalidator,loginvalidator};
