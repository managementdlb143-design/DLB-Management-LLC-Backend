const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const carrierRoutes = require('./routes/carrierRoutes'); // <-- Path bilkul aisa hona chahiye
// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middlewares
app.use(cors()); // Allow requests from frontend domain
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Serve uploaded files statically (e.g., http://localhost:5000/uploads/filename.pdf)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Integration
app.use('/api/carrier', carrierRoutes);

// Base Health Check Route
app.get('/', (req, res) => {
  res.send('Dispatch Services & Freight Carrier API is Running...');
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Dispatch Backend Server running on port ${PORT}`);
});
