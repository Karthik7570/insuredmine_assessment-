const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = 'mongodb://admin:admin@localhost:27017/?authSource=admin';
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to DB:", err.message);
    throw err; // Optional: let the caller handle the error
  }
};

module.exports = connectDB;