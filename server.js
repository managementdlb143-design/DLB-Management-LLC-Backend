const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const carrierRoutes = require('./routes/carrierRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database safely
connectDB().catch((err) => {
  console.error('❌ MongoDB Initial Connection Error:', err.message);
});

const app = express();

// Middlewares
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Integration
app.use('/api/carrier', carrierRoutes);

// Base Health Check Route
app.get('/', (req, res) => {
  res.status(200).send('Dispatch Services & Freight Carrier API is Running...');
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server locally if not running on Vercel
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Dispatch Backend Server running on port ${PORT}`);
  });
}

// Vercel Serverless Function Export
module.exports = app;
