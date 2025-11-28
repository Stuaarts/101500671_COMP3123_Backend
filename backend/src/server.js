require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDb = require('./config/db');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';

connectDb();

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use((err, _req, res, _next) => {
  // Centralized error handler keeps API responses consistent
  console.error(err);
  res.status(500).json({ message: 'Unexpected error', error: err.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
