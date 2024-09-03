const express = require('express')
const router = express.Router()

const {logincontroller} = require('../controller/loginController')

router.post('/',logincontroller)

module.exports = router