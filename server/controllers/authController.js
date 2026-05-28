const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(409).json({ error: 'User already exists with this email' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({ email, password: hashedPassword })
    
    const token = generateToken(user._id)
    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: { id: user._id, email: user.email }
    })
  } catch (err) {
    // Handle mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    res.status(500).json({ error: 'Server error during signup' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = generateToken(user._id)
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email }
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' })
  }
}