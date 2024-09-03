const express =require('express')
const router = express.Router()

const { registercontroller } = require('../controller/registerController')

router.post('/',registercontroller)

module.exports = router