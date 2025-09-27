import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Analytics from './src/models/analytics.js';

dotenv.config();

const createMockAnalyticsData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if analytics data exists
    const count = await Analytics.countDocuments();
    console.log(`Current analytics documents: ${count}`);

    if (count === 0) {
      console.log('No analytics data found. Creating mock data...');
      
      // Create mock analytics data
      const mockData = [];
      const seasons = ['spring', 'summer', 'fall', 'winter'];
      
      for (let i = 0; i < 50; i++) {
        const randomDays = Math.floor(Math.random() * 365);
        const date = new Date();
        date.setDate(date.getDate() - randomDays);
        
        mockData.push({
          listingId: new mongoose.Types.ObjectId(),
          hostId: new mongoose.Types.ObjectId(),
          date: date,
          metrics: {
            views: Math.floor(Math.random() * 100) + 10,
            inquiries: Math.floor(Math.random() * 20) + 1,
            bookings: Math.floor(Math.random() * 10) + 1,
            revenue: Math.floor(Math.random() * 5000) + 500,
            averageRating: Math.random() * 2 + 3, // 3-5 rating
            conversionRate: Math.random() * 0.3 + 0.1, // 10-40%
            occupancyRate: Math.random() * 0.4 + 0.4 // 40-80%
          },
          competitorAnalysis: {
            averageMarketPrice: Math.floor(Math.random() * 8000) + 2000,
            competitorCount: Math.floor(Math.random() * 20) + 5,
            pricePosition: Math.random() > 0.5 ? 'above' : 'below'
          },
          seasonalData: {
            season: seasons[Math.floor(Math.random() * seasons.length)],
            demandIndex: Math.random() * 40 + 60 // 60-100
          }
        });
      }
      
      await Analytics.insertMany(mockData);
      console.log(`Created ${mockData.length} mock analytics documents`);
    } else {
      console.log('Analytics data already exists');
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createMockAnalyticsData();