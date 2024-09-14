const { body, check } = require("express-validator");
const jwt = require("jsonwebtoken");

const registervalidator = [
  body("email")
    .isLength({ min: 1 })
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Invalid email format."),
  body("fname")
    .isLength({ min: 1 })
    .withMessage("First name is required.")
    .isAlpha()
    .withMessage("First name can only contain letters.")
    .trim()
    .escape(),
  body("lname")
    .isLength({ min: 1 })
    .withMessage("Last name is required.")
    .isAlpha()
    .withMessage("Last name can only contain letters.")
    .trim()
    .escape(),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter."),
];
const loginvalidator = [
  body("email")
    .isLength({ min: 1 })
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Invalid email format."),
  body("password")
  .isLength({ min: 5 })
  .withMessage("Password must be at least 5 characters long.")
  .matches(/\d/)
  .withMessage("Password must contain at least one number.")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter."),
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

module.exports = { checkauthadmin, registervalidator, loginvalidator };
