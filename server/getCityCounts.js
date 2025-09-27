import mongoose from 'mongoose';
import Listing from './src/models/listing.js';
import dotenv from 'dotenv';

dotenv.config();

async function getCityCounts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const pipeline = [
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ];
    
    const results = await Listing.aggregate(pipeline);
    console.log('Top 15 cities by hotel count:');
    results.forEach((city, index) => {
      console.log(`${index + 1}. ${city._id}: ${city.count} hotels`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

getCityCounts();