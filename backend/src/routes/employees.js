const express = require('express');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const employeeValidators = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
  body('dateOfJoining').optional().isISO8601().withMessage('Date of joining must be valid'),
];

// Search by department or position
router.get('/search', auth, async (req, res) => {
  const { department, position } = req.query;
  const query = {};
  if (department) {
    query.department = { $regex: department, $options: 'i' };
  }
  if (position) {
    query.position = { $regex: position, $options: 'i' };
  }

  try {
    const results = await Employee.find(query).sort({ createdAt: -1 });
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

// Create employee with optional avatar upload
router.post('/', auth, upload.single('avatar'), employeeValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.avatar = `/uploads/${req.file.filename}`;
    }
    const employee = await Employee.create(payload);
    return res.status(201).json(employee);
  } catch (err) {
    return res.status(500).json({ message: 'Could not create employee', error: err.message });
  }
});

router.get('/', auth, async (_req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return res.json(employees);
  } catch (err) {
    return res.status(500).json({ message: 'Could not fetch employees', error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.json(employee);
  } catch (err) {
    return res.status(500).json({ message: 'Could not fetch employee', error: err.message });
  }
});

router.put('/:id', auth, upload.single('avatar'), employeeValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.json(employee);
  } catch (err) {
    return res.status(500).json({ message: 'Could not update employee', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.json({ message: 'Employee deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Could not delete employee', error: err.message });
  }
});

module.exports = router;
