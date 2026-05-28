const router = require('express').Router()
const { body } = require('express-validator')
const { signup, login } = require('../controllers/authController')
const validateRequest = require('../middleware/validateRequest')

router.post('/signup', 
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ characters')
  ], 
  validateRequest, 
  signup
)

router.post('/login',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  login
)

module.exports = router