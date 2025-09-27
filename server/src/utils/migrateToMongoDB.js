import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from '../models/listing.js';
import User from '../models/user.js';
import { uploadFromUrl } from '../services/cloudinaryService.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Create sample host users
const createSampleHosts = async () => {
  const hosts = [
    {
      firstName: 'John',
      lastName: 'Doe',
      emailId: 'john.doe@wanderlust.com',
      password: 'password123',
      role: 'user',
      phone: '+91 9876543210',
      bio: 'Experienced hotel owner with 10+ years in hospitality',
      location: 'Mumbai, India',
      languages: ['English', 'Hindi'],
      verified: true,
      profileCompleted: true,
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      emailId: 'sarah.johnson@wanderlust.com',
      password: 'password123',
      role: 'user',
      phone: '+91 9876543211',
      bio: 'Luxury resort owner specializing in beachfront properties',
      location: 'Goa, India',
      languages: ['English', 'Portuguese'],
      verified: true,
      profileCompleted: true,
    }
  ];

  console.log('Creating sample host users...');
  const createdHosts = [];
  
  for (const hostData of hosts) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ emailId: hostData.emailId });
      if (existingUser) {
        createdHosts.push(existingUser);
        console.log(`Host ${hostData.firstName} already exists`);
      } else {
        const host = await User.create(hostData);
        createdHosts.push(host);
        console.log(`Created host: ${host.firstName} ${host.lastName}`);
      }
    } catch (error) {
      console.error(`Error creating host ${hostData.firstName}:`, error.message);
    }
  }
  
  return createdHosts;
};

// Enhanced mock listings data with more variety
const mockListingsData = [
  {
    title: "Luxury Beachfront Villa with Private Pool",
    description: "Escape to this stunning beachfront villa in Goa featuring a private pool, direct beach access, and breathtaking ocean views. Perfect for families and groups seeking luxury.",
    location: "Goa, India",
    price: 15000,
    imageUrls: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
    ],
    amenities: ["WiFi", "Pool", "Beach Access", "Air Conditioning", "Kitchen", "Parking"],
    propertyType: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    ratingsAverage: 4.8,
    ratingsQuantity: 124,
  },
  {
    title: "Boutique Heritage Hotel in Old Delhi",
    description: "Experience the charm of Old Delhi in this beautifully restored heritage hotel. Rich in history and culture, offering modern amenities with traditional Indian hospitality.",
    location: "New Delhi, India",
    price: 8500,
    imageUrls: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
    ],
    amenities: ["WiFi", "Restaurant", "Room Service", "Concierge", "Laundry", "Business Center"],
    propertyType: "Hotel",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    ratingsAverage: 4.6,
    ratingsQuantity: 89,
  },
  {
    title: "Mountain Resort with Panoramic Views",
    description: "Wake up to breathtaking mountain vistas at this luxury resort in Manali. Featuring spa services, adventure activities, and world-class dining.",
    location: "Manali, Himachal Pradesh",
    price: 12000,
    imageUrls: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"
    ],
    amenities: ["WiFi", "Spa", "Gym", "Restaurant", "Mountain Views", "Adventure Sports"],
    propertyType: "Resort",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    ratingsAverage: 4.7,
    ratingsQuantity: 156,
  },
  {
    title: "Modern Apartment in Business District",
    description: "Stylish modern apartment perfect for business travelers. Located in the heart of Bangalore's tech hub with easy access to major offices and shopping centers.",
    location: "Bangalore, Karnataka",
    price: 4500,
    imageUrls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
    ],
    amenities: ["WiFi", "Air Conditioning", "Kitchen", "Parking", "Security", "Metro Access"],
    propertyType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    ratingsAverage: 4.4,
    ratingsQuantity: 67,
  },
  {
    title: "Traditional Kerala Houseboat Experience",
    description: "Unique floating accommodation on the serene backwaters of Alleppey. Experience traditional Kerala hospitality while cruising through coconut groves and paddy fields.",
    location: "Alleppey, Kerala",
    price: 9500,
    imageUrls: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
    ],
    amenities: ["WiFi", "Kitchen", "Traditional Meals", "Backwater Views", "Fishing", "Cultural Tours"],
    propertyType: "Cottage",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    ratingsAverage: 4.9,
    ratingsQuantity: 203,
  },
  {
    title: "Eco-Friendly Hill Station Retreat",
    description: "Sustainable accommodation in the beautiful hills of Coorg. Solar-powered, organic meals, and surrounded by coffee plantations and spice gardens.",
    location: "Coorg, Karnataka",
    price: 6500,
    imageUrls: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
    ],
    amenities: ["WiFi", "Organic Meals", "Nature Walks", "Coffee Tours", "Solar Power", "Garden Views"],
    propertyType: "Guesthouse",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    ratingsAverage: 4.5,
    ratingsQuantity: 78,
  },
  {
    title: "Luxury Desert Camp in Rajasthan",
    description: "Experience the magic of the Thar Desert in luxury tents with modern amenities. Camel safaris, cultural performances, and stargazing included.",
    location: "Jaisalmer, Rajasthan",
    price: 11000,
    imageUrls: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800"
    ],
    amenities: ["WiFi", "Cultural Shows", "Camel Safari", "Desert Views", "Traditional Meals", "Stargazing"],
    propertyType: "Cottage",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    ratingsAverage: 4.8,
    ratingsQuantity: 145,
  },
  {
    title: "Budget-Friendly Hostel in Mumbai",
    description: "Clean, safe, and social accommodation in the heart of Mumbai. Perfect for backpackers and solo travelers looking to explore the city on a budget.",
    location: "Mumbai, Maharashtra",
    price: 1200,
    imageUrls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
    ],
    amenities: ["WiFi", "Shared Kitchen", "Lockers", "Common Area", "Laundry", "24/7 Security"],
    propertyType: "Hostel",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 1,
    ratingsAverage: 4.2,
    ratingsQuantity: 234,
  }
];

const migrateListingsToMongoDB = async () => {
  try {
    // Clear existing listings
    console.log('Clearing existing listings...');
    await Listing.deleteMany({});

    // Create sample hosts
    const hosts = await createSampleHosts();
    if (hosts.length === 0) {
      throw new Error('No hosts created, cannot proceed with listings');
    }

    console.log('Starting migration of listings to MongoDB with Cloudinary images...');
    
    for (let i = 0; i < mockListingsData.length; i++) {
      const listingData = mockListingsData[i];
      console.log(`\\nProcessing listing ${i + 1}/${mockListingsData.length}: ${listingData.title}`);

      try {
        // Upload images to Cloudinary
        const uploadedImages = [];
        
        for (let j = 0; j < listingData.imageUrls.length; j++) {
          const imageUrl = listingData.imageUrls[j];
          console.log(`  Uploading image ${j + 1}/${listingData.imageUrls.length}...`);
          
          const filename = `listing_${i + 1}_image_${j + 1}`;
          const uploadResult = await uploadFromUrl(imageUrl, 'wanderlust/listings', filename);
          
          uploadedImages.push({
            url: uploadResult.url,
            public_id: uploadResult.public_id,
          });
          
          console.log(`  ✅ Image uploaded: ${uploadResult.public_id}`);
        }

        // Create listing in MongoDB
        const listing = new Listing({
          title: listingData.title,
          description: listingData.description,
          location: listingData.location,
          price: listingData.price,
          images: uploadedImages,
          amenities: listingData.amenities,
          propertyType: listingData.propertyType,
          bedrooms: listingData.bedrooms,
          bathrooms: listingData.bathrooms,
          maxGuests: listingData.maxGuests,
          host: hosts[i % hosts.length]._id, // Distribute among available hosts
          ratingsAverage: listingData.ratingsAverage,
          ratingsQuantity: listingData.ratingsQuantity,
          isAvailable: true,
        });

        const savedListing = await listing.save();
        console.log(`✅ Created listing: ${savedListing.title} (ID: ${savedListing._id})`);

      } catch (error) {
        console.error(`❌ Error processing listing ${listingData.title}:`, error.message);
      }
    }

    const totalListings = await Listing.countDocuments();
    console.log(`\\n🎉 Migration completed! Total listings in database: ${totalListings}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the migration
console.log('🚀 Starting comprehensive migration to MongoDB + Cloudinary...');
migrateListingsToMongoDB();