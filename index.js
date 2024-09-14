const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const mysql = require("./services/server"); // connectserver
const app = express();
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const helmet = require('helmet')

const limit = rateLimit({
  windowMS: 1000 * 60 * 15, // 15 min
  max: 100,
  message: "Too many requests, please try again later",
});


//routes
const userRoute = require('./routes/userRoute')
const register = require('./routes/register')
const login = require('./routes/login')
const token = require('./routes/token')
const productRoute = require('./routes/productRoute')


//middleware
const {registervalidator,checkauthadmin,loginvalidator} = require("./services/middleware");
app.use(
  cors({
    origin: [process.env.URL],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);
app.use(helmet())
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(limit);

//multer
const upload = require('./services/multerConfig')
//check multer


//product
app.use('/product',productRoute)
//register ,login
app.use("/register",registervalidator, register);
app.use("/login",loginvalidator,login)
//Protected userRoute
app.use('/users',checkauthadmin,userRoute)
//checktoken
app.use("/checkcookie", token);
app.get('/',(req,res)=>{
  res.send("API IS WORKING")
})

app.listen(process.env.PORT, (err) => {
  if (err) return err;
  console.log(`connected to server on port ${process.env.PORT}`);
  
});
