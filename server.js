const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

connectDB().catch((err) => {
  console.error('MongoDB Connection Error:', err.message);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🛑 Temporary carrierRoutes hata kar check kar rahe hain taaki server live ho jaye
app.get('/api/carrier', (req, res) => {
  res.json({ message: "Carrier API temporary route working" });
});

app.get('/', (req, res) => {
  res.status(200).send('Dispatch Services & Freight Carrier API is Running...');
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;