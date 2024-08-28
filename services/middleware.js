const {body} = require('express-validator')

const registervalidator = [
    body('email').isLength({min:1}).isEmail().trim().escape().withMessage("Email error")
]

module.exports = registervalidator;