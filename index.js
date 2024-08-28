const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const mysql = require("./services/server");
const app = express();
require("dotenv").config();
//middleware
app.use(
  cors(
    {
      origin: [process.env.URL],
      credentials: true,
    },
  )
);
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const registervalidator = require("./services/middleware");

app.post("/register", registervalidator, (req, res) => {
  //check validatorresult
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(500).json(error.errors[0].msg);

  const query = "INSERT INTO users(email,fname,lname,password) values(?)";
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Hash password error" });

    const data = [req.body.email, req.body.fname, req.body.lname, hash];
    mysql.query(query, [data], (err, value) => {
      if (err) return res.status(500).json(err);
      const token = jwt.sign(
        { email: req.body.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false,
      });
      res.status(200).json({ message: "Insert success", value });
      res.end();
    });
  });
});

app.post("/login", (req, res) => {
  const query = "SELECT * FROM users where email=  ?";
  mysql.query(query, [req.body.email], (err, result) => {
    if (err) return res.status(500).json({ msg: err });

    if (result.length === 0)
      return res.status(404).json({ msg: "No user found." });

    const user = result[0];
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result === false)
        return res.status(403).json({ msg: "password is wrong." });

      const token = jwt.sign(
        { email: req.body.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'None'
      });
      res.status(200).json({ msg: "pass" });
      res.end();
    });
  });
});

app.get("/checkcookie", (req, res) => {
  const cookie = req.cookies["token"];
  if (!cookie) return res.json("no cookie");
  jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
    if(err) return res.json("Cookie is wrong")
    res.json(decoded)
  });
  
  res.end();
});
app.listen(process.env.PORT, (err) => {
  if (err) return err;
  console.log(`connected to server on port ${process.env.PORT}`);
});
