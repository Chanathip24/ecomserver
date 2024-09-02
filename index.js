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
  cors({
    origin: [process.env.URL],
    credentials: true,
  })
);
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const checkauthadmin = require("./services/middleware")

//create cookie
const setcookie = (res,key,value)=>{
  res.cookie(key, value, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV ==='production',
    sameSite : "None"
  });

}

app.post("/register", (req, res) => {
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
        { email: req.body.email , role : "MEMBER" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      setcookie(res,"token",token)

      res.status(200).json({ message: "Insert success", value });
      res.end();
    });
  });
});

//get all users data
app.get('/users',checkauthadmin,(req,res)=>{
  const query = "SELECT id,email,fname,lname,created_at,role FROM users"
  mysql.query(query,(err,result)=>{
    if(err) return res.status(500).json({err})
    if(result.length === 0 ) return res.status(404).json({msg : "no data kub pom"})
    res.status(200).json({result : result})
    res.end();
  })
})

//delete user
app.delete('/users/delete/:id',checkauthadmin,(req,res)=>{
  const query = "DELETE FROM users where id = ?"
  const id = req.params.id
  mysql.query(query,[id],(err)=>{
    if(err) res.json({msg : err})
    res.status(200).json({msg : "Delete Success"})
    res.end()
  })
})

//login
app.post("/login", (req, res) => {
  const query = "SELECT * FROM users where email=  ?";

  //start query
  mysql.query(query, [req.body.email], (err, result) => {
    if (err) return res.status(500).json({ msg: err });

    if (result.length === 0)
      return res.status(404).json({ msg: "No user found." });
    
    const user = result[0];
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(err) res.status(500).json({msg : "Hash error"})
      if (result === false)
        return res.status(403).json({ msg: "password is wrong." });

      const token = jwt.sign(
        { email: req.body.email,role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      //create cookie
      setcookie(res,"token",token)
      res.status(200).json({ msg: "pass" });
      res.end();
    });
  });
});

//logout
app.get('/logout', (req, res) => {
  const token = req.cookies['token'];
  if (!token) {
    return res.json({ msg: token });
  }
  res.clearCookie('token');
  res.json({ msg: "pass" });
});

//checkcookie
app.get("/checkcookie", (req, res) => {
  const cookie = req.cookies["token"];
  if (!cookie) return res.json({msg: "no cookie"});
  jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.json({msg : "no cookie"});
    const role = decoded.role
    res.json({msg : "pass" , role});
  });

  res.end();
});
app.listen(process.env.PORT, (err) => {
  if (err) return err;
  console.log(`connected to server on port ${process.env.PORT}`);

});
