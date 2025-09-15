const mongoose = require("mongoose");

module.exports.connect = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.log("⚠️  MONGO_URL not found in .env file");
      return;
    }
    
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    console.log("⚠️  Server will continue without database connection");
    console.log("🔧 Please check your MongoDB configuration in .env file");
  }
};