const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed });
      const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
      return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      return res.status(500).json({ message: 'Signup failed', error: err.message });
    }
  }
);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email is required'), body('password').exists().withMessage('Password is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      return res.status(500).json({ message: 'Login failed', error: err.message });
    }
  }
);

module.exports = router;
