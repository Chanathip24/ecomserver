const mysql = require("../services/server");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const logincontroller = (req, res) => {
    //validator
    const error = validationResult(req)
    if(!error.isEmpty()) return res.json(error.errors[0].msg)
  
    //start
    const query = "SELECT * FROM users where email=  ?";
    mysql.query(query, [req.body.email], (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if (result.length === 0)
        return res.status(404).json({ msg: "No user found." });
  
      const user = result[0];
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) res.status(500).json({ msg: "Hash error" });
        if (!result )
          return res.status(403).json({ msg: "password is wrong." });
  
        const token = jwt.sign(
          { email: req.body.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        //create header
        res.setHeader("Authorization", `Bearer ${token}`);
        res.status(200).json({ msg: "pass" });
        res.end();
      });
    });
  }
module.exports = {logincontroller}