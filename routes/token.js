const express =require('express')
const router = express.Router()

const { token } = require('../controller/tokenController')

router.get('/',token)

module.exports = router