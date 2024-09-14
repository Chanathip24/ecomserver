const express = require('express')
const router = express.Router()

const { addproduct } = require('../controller/productController') ;
router.post('/addproduct',addproduct)

module.exports = router;