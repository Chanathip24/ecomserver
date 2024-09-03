const express = require('express')

const router = express.Router()


const { getall,deleteuser } =  require('../controller/userController')

//getall user
router.get('/',getall)
//delete id
router.delete('/delete/:id',deleteuser)

module.exports = router