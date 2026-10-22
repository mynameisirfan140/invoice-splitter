const express = require('express');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/invoices', invoiceRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;