// File: config/database.js
const mongoose = require('mongoose');
const SecretsManager = require('./secrets');

const connectDB = async () => {
  try {
    const secretsManager = new SecretsManager();
    
    // Get MongoDB URI from secrets (with fallback for local development)
    const mongoURI = await secretsManager.getMongoDBURI();
    
    if (!mongoURI) {
      throw new Error('MongoDB connection string not found in any secrets source');
    }
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Don't log the full URI in production
    
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

