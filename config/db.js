const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Both common ENV names check karein
    const connString = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!connString) {
      throw new Error("MONGO_URI is undefined. Please check Vercel Environment Variables.");
    }

    const conn = await mongoose.connect(connString);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;