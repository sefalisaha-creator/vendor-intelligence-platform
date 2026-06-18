const express = require('express');
const cors = require('cors');

// Import Custom Route Modules
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend server is healthy' });
});

// Mounted Application Routes
app.use('/api/auth', authRoutes); // Auth subsystem routing channel mount point
app.use('/api/vendors', vendorRoutes);
app.use('/api/vendors', ledgerRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

module.exports = app;