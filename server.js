const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const carrierRoutes = require('./routes/carrierRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().catch((err) => {
  console.error('MongoDB Connection Error:', err.message);
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Integration (Ensure carrierRoutes is a valid router function)
if (carrierRoutes) {
  app.use('/api/carrier', carrierRoutes);
}

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

// Start Server locally
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;