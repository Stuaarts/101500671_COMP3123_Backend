const mongoose = require('mongoose');

const connectDb = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/comp3123_assignment';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected`);
  } catch (err) {
    console.error('Mongo connection error', err.message);
    process.exit(1);
  }
};

module.exports = connectDb;
