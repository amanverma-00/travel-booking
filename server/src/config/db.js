import mongoose from 'mongoose';

async function connectDB() {
  try {
    const connectionString = process.env.MONGODB_URI;

    await mongoose.connect(connectionString);
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default connectDB;