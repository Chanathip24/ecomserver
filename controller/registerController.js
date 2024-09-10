const mysql = require("../services/server");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registercontroller = (req, res) => {
    //check validatorresult
    const error = validationResult(req);
    if (!error.isEmpty()) return res.json(error.errors[0].msg);
  
    const query = "INSERT INTO users(email,fname,lname,password) values(?)";
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: "Hash password error" });
  
      const data = [req.body.email, req.body.fname, req.body.lname, hash];
      mysql.query(query, [data], (err, value) => {
        if (err) return res.json("This email is already registered.").status(500);
        const token = jwt.sign(
          { email: req.body.email, role: "CUSTOMER" },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        res.setHeader("Authorization", `Bearer ${token}`);
        res.status(200).json({ message: "Insert success",value});
        res.end();
      });
    });
  }
module.exports = {registercontroller}