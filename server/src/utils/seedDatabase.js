import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../models/listing.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Create a sample host ID
const hostId = new mongoose.Types.ObjectId();

const sampleListings = [
  {
    title: "Luxury Beachfront Villa with Private Pool",
    description: "Escape to this stunning beachfront villa in Goa featuring a private pool, direct beach access, and breathtaking ocean views. Perfect for families and groups seeking luxury.",
    location: "Goa, India",
    price: 15000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        public_id: "villa_goa_1",
      },
    ],
    amenities: ["WiFi", "Pool", "Beach Access", "Air Conditioning", "Kitchen", "Parking"],
    propertyType: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    host: hostId,
    ratingsAverage: 4.8,
    ratingsQuantity: 25,
    isAvailable: true,
  },
  {
    title: "Mountain Resort with Valley Views",
    description: "Experience the serenity of the Himalayas at this beautiful mountain resort in Manali. Features stunning valley views and modern amenities.",
    location: "Manali, Himachal Pradesh",
    price: 8500,
    images: [
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        public_id: "resort_manali_1",
      },
    ],
    amenities: ["WiFi", "Heating", "Restaurant", "Spa", "Mountain View"],
    propertyType: "Resort",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    host: hostId,
    ratingsAverage: 4.6,
    ratingsQuantity: 18,
    isAvailable: true,
  },
  {
    title: "Modern Business Hotel in Mumbai",
    description: "Stay in the heart of Mumbai's business district at this modern hotel offering comfort and convenience for business travelers.",
    location: "Mumbai, Maharashtra",
    price: 6500,
    images: [
      {
        url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        public_id: "hotel_mumbai_1",
      },
    ],
    amenities: ["WiFi", "Gym", "Business Center", "Restaurant", "Concierge"],
    propertyType: "Hotel",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    host: hostId,
    ratingsAverage: 4.4,
    ratingsQuantity: 42,
    isAvailable: true,
  },
  {
    title: "Cozy Tea Garden Cottage",
    description: "Nestled in the beautiful tea gardens of Darjeeling, this cozy cottage offers a peaceful retreat with stunning mountain views.",
    location: "Darjeeling, West Bengal",
    price: 4500,
    images: [
      {
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
        public_id: "cottage_darjeeling_1",
      },
    ],
    amenities: ["WiFi", "Garden View", "Tea Service", "Fireplace", "Mountain View"],
    propertyType: "Cottage",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    host: hostId,
    ratingsAverage: 4.7,
    ratingsQuantity: 15,
    isAvailable: true,
  },
  {
    title: "Spacious Beachside Apartment",
    description: "This spacious apartment in Kochi offers easy access to the beach and features modern amenities perfect for a family vacation.",
    location: "Kochi, Kerala",
    price: 3500,
    images: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        public_id: "apartment_kochi_1",
      },
    ],
    amenities: ["WiFi", "Beach Access", "Balcony", "Kitchen", "Parking"],
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    host: hostId,
    ratingsAverage: 4.3,
    ratingsQuantity: 22,
    isAvailable: true,
  },
  {
    title: "Budget Hostel in Delhi",
    description: "Clean and comfortable hostel accommodation in the heart of Delhi, perfect for budget-conscious travelers and backpackers.",
    location: "Delhi, India",
    price: 1200,
    images: [
      {
        url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
        public_id: "hostel_delhi_1",
      },
    ],
    amenities: ["WiFi", "Common Area", "Lockers", "Shared Kitchen"],
    propertyType: "Hostel",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 1,
    host: hostId,
    ratingsAverage: 4.1,
    ratingsQuantity: 8,
    isAvailable: true,
  },
  {
    title: "Traditional Rajasthani Guesthouse",
    description: "Experience authentic Rajasthani hospitality at this beautiful traditional guesthouse in the heart of Udaipur with garden views.",
    location: "Udaipur, Rajasthan",
    price: 2800,
    images: [
      {
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
        public_id: "guesthouse_udaipur_1",
      },
    ],
    amenities: ["WiFi", "Garden", "Traditional Architecture", "Cultural Tours", "Restaurant"],
    propertyType: "Guesthouse",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    host: hostId,
    ratingsAverage: 4.5,
    ratingsQuantity: 12,
    isAvailable: true,
  },
  {
    title: "Lakeside Bungalow in Nainital",
    description: "Serene lakeside bungalow offering stunning lake views and peaceful surroundings, perfect for a romantic getaway or family retreat.",
    location: "Nainital, Uttarakhand",
    price: 7200,
    images: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        public_id: "bungalow_nainital_1",
      },
    ],
    amenities: ["WiFi", "Lake View", "Boating", "Garden", "Fireplace", "Parking"],
    propertyType: "Bungalow",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    host: hostId,
    ratingsAverage: 4.9,
    ratingsQuantity: 35,
    isAvailable: true,
  },
  {
    title: "Luxury Spa Resort in Rishikesh",
    description: "Rejuvenate your mind and body at this luxury spa resort in the yoga capital of the world, featuring wellness treatments and meditation sessions.",
    location: "Rishikesh, Uttarakhand",
    price: 12500,
    images: [
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        public_id: "resort_rishikesh_1",
      },
    ],
    amenities: ["WiFi", "Spa", "Yoga Classes", "Meditation", "Restaurant", "River View"],
    propertyType: "Resort",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    host: hostId,
    ratingsAverage: 4.8,
    ratingsQuantity: 28,
    isAvailable: true,
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing listings
    await Listing.deleteMany({});
    console.log('Cleared existing listings');

    // Insert sample listings
    const listings = await Listing.insertMany(sampleListings);
    console.log(`Inserted ${listings.length} sample listings`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();