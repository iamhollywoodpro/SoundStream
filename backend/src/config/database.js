const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor() {
    this.mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/soundstream';
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    };
  }

  async connect() {
    try {
      await mongoose.connect(this.mongoUrl, this.options);
      console.log('🚀 Connected to MongoDB successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('🚨 MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

      return mongoose.connection;
    } catch (error) {
      console.error('🚨 Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('👋 Disconnected from MongoDB');
    } catch (error) {
      console.error('🚨 Error disconnecting from MongoDB:', error);
    }
  }

  getConnection() {
    return mongoose.connection;
  }
}

module.exports = new Database();