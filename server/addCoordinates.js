import mongoose from 'mongoose';
import Listing from './src/models/listing.js';
import dotenv from 'dotenv';

dotenv.config();

// City coordinates mapping
const cityCoordinates = {
  'New York': { lat: 40.7128, lng: -74.0060 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'Miami': { lat: 25.7617, lng: -80.1918 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Paris': { lat: 48.8566, lng: 2.3522 },
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Barcelona': { lat: 41.3851, lng: 2.1734 },
  'Amsterdam': { lat: 52.3676, lng: 4.9041 },
  'Berlin': { lat: 52.5200, lng: 13.4050 },
  'Sydney': { lat: -33.8688, lng: 151.2093 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Kerala': { lat: 10.8505, lng: 76.2711 },
  'Delhi': { lat: 28.7041, lng: 77.1025 }
};

// Function to add slight random offset to coordinates (to avoid all listings being in exact same spot)
function addRandomOffset(lat, lng) {
  const offsetRange = 0.05; // About 5km variation
  return {
    lat: lat + (Math.random() - 0.5) * offsetRange,
    lng: lng + (Math.random() - 0.5) * offsetRange
  };
}

async function addCoordinatesToListings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings to update with coordinates`);
    
    let updatedCount = 0;
    
    for (const listing of listings) {
      const city = listing.location?.city;
      if (!city) {
        console.log(`Skipping listing ${listing.title} - no city found`);
        continue;
      }
      
      // Find base coordinates for the city
      let baseCoords = null;
      for (const [cityName, coords] of Object.entries(cityCoordinates)) {
        if (city.toLowerCase().includes(cityName.toLowerCase()) || cityName.toLowerCase().includes(city.toLowerCase())) {
          baseCoords = coords;
          break;
        }
      }
      
      if (!baseCoords) {
        // Default to London if city not found
        console.log(`City ${city} not found in mapping, using London coordinates`);
        baseCoords = cityCoordinates['London'];
      }
      
      // Add random offset to avoid exact duplicates
      const coordinates = addRandomOffset(baseCoords.lat, baseCoords.lng);
      
      // Update the listing
      await Listing.findByIdAndUpdate(listing._id, {
        'location.coordinates': coordinates
      });
      
      updatedCount++;
      console.log(`✅ Updated ${listing.title} in ${city} with coordinates: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`);
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} listings with coordinates!`);
    
  } catch (error) {
    console.error('Error updating coordinates:', error);
  } finally {
    mongoose.connection.close();
  }
}

addCoordinatesToListings();