const mongoose = require('mongoose');
// mongodb://localhost:27017/collab-hub
//process.env.MONGO_URI
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed: ", err);
    process.exit(1);
  }
};

module.exports = connectDB;
