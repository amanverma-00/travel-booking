// Define the 9 property types from the database model
export const PROPERTY_CATEGORIES = [
  {
    id: 'hotel',
    name: 'Hotels',
    types: ['Hotel'],
    description: 'Premium hotels with exceptional service and amenities'
  },
  {
    id: 'resort',
    name: 'Resorts',
    types: ['Resort'],
    description: 'All-inclusive resorts for the ultimate vacation experience'
  },
  {
    id: 'villa',
    name: 'Villas',
    types: ['Villa'],
    description: 'Luxurious villas with private pools and stunning views'
  },
  {
    id: 'apartment',
    name: 'Apartments',
    types: ['Apartment'],
    description: 'Modern apartments in prime city locations'
  },
  {
    id: 'cottage',
    name: 'Cottages',
    types: ['Cottage'],
    description: 'Charming cottages perfect for romantic getaways'
  },
  {
    id: 'hostel',
    name: 'Hostels',
    types: ['Hostel'],
    description: 'Budget-friendly hostels for backpackers and solo travelers'
  },
  {
    id: 'guesthouse',
    name: 'Guesthouses',
    types: ['Guesthouse'],
    description: 'Cozy guesthouses with personalized local hospitality'
  },
  {
    id: 'motel',
    name: 'Motels',
    types: ['Motel'],
    description: 'Convenient motels for road trips and quick stays'
  },
  {
    id: 'bungalow',
    name: 'Bungalows',
    types: ['Bungalow'],
    description: 'Tropical bungalows near beaches and scenic locations'
  }
];

/**
 * Fetch all listings from the API
 * @returns {Promise<Array>} Array of all listings
 */
export const fetchAllListings = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/listings?limit=100');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching listings:', error);
    // Return mock data on error
    return getMockListings();
  }
};

/**
 * Groups listings by property type categories
 * @param {Array} listings - Array of all listings
 * @returns {Object} Object with category ids as keys and arrays of listings as values
 */
export const getListingsByCategory = (listings) => {
  const categorizedListings = {};
  
  // Initialize all categories with empty arrays
  PROPERTY_CATEGORIES.forEach(category => {
    categorizedListings[category.id] = [];
  });

  // Group listings by their property types
  listings.forEach(listing => {
    const matchingCategory = PROPERTY_CATEGORIES.find(category => 
      category.types.includes(listing.propertyType)
    );
    
    if (matchingCategory) {
      categorizedListings[matchingCategory.id].push(listing);
    }
  });

  return categorizedListings;
};

/**
 * Get listings for a specific category
 * @param {Array} listings - Array of all listings
 * @param {string} categoryId - The category ID
 * @param {number} limit - Maximum number of listings to return
 * @returns {Array} Array of listings for the category
 */
export const getCategoryListings = (listings, categoryId, limit = null) => {
  const allListings = getListingsByCategory(listings);
  const categoryListings = allListings[categoryId] || [];
  
  return limit ? categoryListings.slice(0, limit) : categoryListings;
};

/**
 * Get category information by ID
 * @param {string} categoryId - The category ID
 * @returns {Object} Category information
 */
export const getCategoryInfo = (categoryId) => {
  return PROPERTY_CATEGORIES.find(category => category.id === categoryId);
};

/**
 * Get featured listings for homepage (mix from all categories)
 * @param {Array} listings - Array of all listings
 * @param {number} perCategory - Number of listings per category
 * @returns {Array} Array of objects with category info and listings
 */
export const getFeaturedListings = (listings, perCategory = null) => {
  const allListings = getListingsByCategory(listings);
  
  return PROPERTY_CATEGORIES.map(category => ({
    ...category,
    listings: perCategory ? allListings[category.id].slice(0, perCategory) : allListings[category.id]
  })).filter(category => category.listings.length > 0);
};

/**
 * Comprehensive sample listings data - 5+ listings per property type (45+ total)
 * @returns {Array} Array of comprehensive sample listings
 */
export const getMockListings = () => {
  return [
    // Hotels - 6 listings
    {
      _id: "hotel_1",
      title: "Luxury Oceanfront Hotel Miami",
      description: "Experience unparalleled luxury with breathtaking ocean views, world-class spa services, and award-winning dining in the heart of Miami Beach.",
      location: "Miami Beach, FL, USA",
      propertyType: "Hotel",
      price: 45000,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.8,
      ratingsQuantity: 342,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372329/wanderlust/listings/hotel_miami_luxury.jpg", public_id: "wanderlust/listings/hotel_miami_luxury" }
      ],
      amenities: ["Ocean View", "Spa", "Fine Dining", "Room Service", "Concierge", "Pool"],
      isAvailable: true
    },
    {
      _id: "hotel_2",
      title: "Grand Manhattan Hotel",
      description: "Sophisticated urban hotel in the heart of Manhattan with modern amenities, stunning skyline views, and proximity to Times Square.",
      location: "New York, NY, USA",
      propertyType: "Hotel",
      price: 35000,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      ratingsAverage: 4.6,
      ratingsQuantity: 458,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372330/wanderlust/listings/hotel_manhattan_grand.jpg", public_id: "wanderlust/listings/hotel_manhattan_grand" }
      ],
      amenities: ["City Views", "Business Center", "Fitness Center", "Restaurant", "WiFi", "Valet"],
      isAvailable: true
    },
    {
      _id: "hotel_3",
      title: "Historic Charleston Boutique Hotel",
      description: "Charming historic hotel with authentic Southern architecture, personalized service, and cobblestone courtyards in Charleston's old town.",
      location: "Charleston, SC, USA",
      propertyType: "Hotel",
      price: 27500,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.7,
      ratingsQuantity: 298,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372331/wanderlust/listings/hotel_charleston_historic.jpg", public_id: "wanderlust/listings/hotel_charleston_historic" }
      ],
      amenities: ["Historic Charm", "Courtyard", "Local Tours", "Fine Dining", "WiFi", "Concierge"],
      isAvailable: true
    },
    {
      _id: "hotel_4",
      title: "Aspen Mountain Resort Hotel",
      description: "Elegant mountain resort hotel with panoramic alpine views, ski-in/ski-out access, and luxury amenities in Colorado's premier ski destination.",
      location: "Aspen, CO, USA",
      propertyType: "Hotel",
      price: 52000,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.9,
      ratingsQuantity: 176,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372333/wanderlust/listings/hotel_aspen_mountain.jpg", public_id: "wanderlust/listings/hotel_aspen_mountain" }
      ],
      amenities: ["Ski Access", "Mountain Views", "Spa", "Fine Dining", "Fireplace", "Concierge"],
      isAvailable: true
    },
    {
      _id: "hotel_5",
      title: "Hawaiian Paradise Beach Hotel",
      description: "Tropical beachfront hotel with private beach access, water sports, and authentic Hawaiian hospitality in beautiful Honolulu.",
      location: "Honolulu, HI, USA",
      propertyType: "Hotel",
      price: 39500,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      ratingsAverage: 4.8,
      ratingsQuantity: 523,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372334/wanderlust/listings/hotel_hawaii_paradise.jpg", public_id: "wanderlust/listings/hotel_hawaii_paradise" }
      ],
      amenities: ["Private Beach", "Water Sports", "Pool", "Luau Shows", "Spa", "Tropical Gardens"],
      isAvailable: true
    },
    {
      _id: "hotel_6",
      title: "San Francisco Urban Boutique",
      description: "Modern boutique hotel in downtown San Francisco with panoramic bay views, contemporary design, and easy access to all major attractions.",
      location: "San Francisco, CA, USA",
      propertyType: "Hotel",
      price: 31000,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.5,
      ratingsQuantity: 267,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372335/wanderlust/listings/hotel_sf_boutique.jpg", public_id: "wanderlust/listings/hotel_sf_boutique" }
      ],
      amenities: ["Bay Views", "Modern Design", "Rooftop Bar", "Fitness Center", "WiFi", "Pet Friendly"],
      isAvailable: true
    },

    // Resorts - 5 listings
    {
      _id: "resort_1",
      title: "Tropical Paradise Resort Cancun",
      description: "All-inclusive tropical resort with multiple pools, gourmet restaurants, and endless activities on Cancun's pristine beaches.",
      location: "Cancun, Mexico",
      propertyType: "Resort",
      price: 68000,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      ratingsAverage: 4.7,
      ratingsQuantity: 789,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372336/wanderlust/listings/resort_cancun_tropical.jpg", public_id: "wanderlust/listings/resort_cancun_tropical" }
      ],
      amenities: ["All Inclusive", "Multiple Pools", "Beachfront", "Spa", "Water Sports", "Kids Club"],
      isAvailable: true
    },
    {
      _id: "resort_2",
      title: "Whistler Mountain Ski Resort",
      description: "Premier ski resort with luxury accommodations, world-class slopes, and year-round mountain activities in British Columbia.",
      location: "Whistler, BC, Canada",
      propertyType: "Resort",
      price: 75000,
      bedrooms: 3,
      bathrooms: 3,
      maxGuests: 6,
      ratingsAverage: 4.8,
      ratingsQuantity: 456,
      images: [
        { url: "https://images.unsplash.com/photo-1551524164-6cf2ac2d2bb5?w=800", public_id: "resort_whistler_ski" }
      ],
      amenities: ["Ski-in/Ski-out", "Mountain Views", "Multiple Restaurants", "Spa", "Hot Tub", "Equipment Rental"],
      isAvailable: true
    },
    {
      _id: "resort_3",
      title: "Scottsdale Desert Spa Resort",
      description: "Luxury desert resort focused on wellness, world-class spa treatments, championship golf, and stunning Sonoran Desert views.",
      location: "Scottsdale, AZ, USA",
      propertyType: "Resort",
      price: 48500,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.9,
      ratingsQuantity: 234,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372338/wanderlust/listings/resort_scottsdale_desert.jpg", public_id: "wanderlust/listings/resort_scottsdale_desert" }
      ],
      amenities: ["World-Class Spa", "Championship Golf", "Pool", "Desert Tours", "Wellness Programs", "Fine Dining"],
      isAvailable: true
    },
    {
      _id: "resort_4",
      title: "Caribbean Beach Resort Barbados",
      description: "Luxury beachfront resort with crystal clear waters, white sand beaches, water sports, and authentic Caribbean culture.",
      location: "Barbados, Caribbean",
      propertyType: "Resort",
      price: 58000,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      ratingsAverage: 4.6,
      ratingsQuantity: 312,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372339/wanderlust/listings/resort_barbados_beach.jpg", public_id: "wanderlust/listings/resort_barbados_beach" }
      ],
      amenities: ["Private Beach", "Water Sports", "Multiple Restaurants", "Spa", "Cultural Shows", "Snorkeling"],
      isAvailable: true
    },
    {
      _id: "resort_5",
      title: "Maldives Overwater Resort",
      description: "Exclusive overwater villas in the Maldives with direct ocean access, coral reef snorkeling, and unparalleled luxury in paradise.",
      location: "Maldives, Indian Ocean",
      propertyType: "Resort",
      price: 125000,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.9,
      ratingsQuantity: 145,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372340/wanderlust/listings/resort_maldives_overwater.jpg", public_id: "wanderlust/listings/resort_maldives_overwater" }
      ],
      amenities: ["Overwater Villa", "Private Deck", "Coral Reef", "Spa", "Fine Dining", "Water Sports"],
      isAvailable: true
    },

    // Villas - 5 listings
    {
      _id: "villa_1",
      title: "Mediterranean Villa Santorini",
      description: "Stunning Mediterranean-style villa with infinity pool, olive gardens, and breathtaking caldera views in iconic Santorini.",
      location: "Santorini, Greece",
      propertyType: "Villa",
      price: 85000,
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      ratingsAverage: 4.9,
      ratingsQuantity: 167,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372341/wanderlust/listings/villa_santorini_mediterranean.jpg", public_id: "wanderlust/listings/villa_santorini_mediterranean" }
      ],
      amenities: ["Infinity Pool", "Caldera Views", "Private Chef", "Wine Cellar", "Terrace", "Garden"],
      isAvailable: true
    },
    {
      _id: "villa_2",
      title: "Hollywood Hills Luxury Villa",
      description: "Modern luxury villa perched in the Hollywood Hills with infinity pool, city views, and state-of-the-art entertainment systems.",
      location: "Los Angeles, CA, USA",
      propertyType: "Villa",
      price: 120000,
      bedrooms: 5,
      bathrooms: 4,
      maxGuests: 10,
      ratingsAverage: 4.8,
      ratingsQuantity: 89,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372342/wanderlust/listings/villa_hollywood_luxury.jpg", public_id: "wanderlust/listings/villa_hollywood_luxury" }
      ],
      amenities: ["Infinity Pool", "City Views", "Home Theater", "Wine Cellar", "Chef's Kitchen", "Security"],
      isAvailable: true
    },
    {
      _id: "villa_3",
      title: "Tuscan Vineyard Villa",
      description: "Authentic Tuscan villa surrounded by vineyards with traditional architecture, wine tastings, and rolling countryside views.",
      location: "Florence, Italy",
      propertyType: "Villa",
      price: 67500,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      ratingsAverage: 4.7,
      ratingsQuantity: 123,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372343/wanderlust/listings/villa_tuscany_vineyard.jpg", public_id: "wanderlust/listings/villa_tuscany_vineyard" }
      ],
      amenities: ["Vineyard Views", "Wine Tasting", "Traditional Architecture", "Full Kitchen", "Garden", "Tours"],
      isAvailable: true
    },
    {
      _id: "villa_4",
      title: "Maui Tropical Island Villa",
      description: "Secluded tropical villa with private beach access, lush tropical gardens, and authentic Hawaiian island lifestyle.",
      location: "Maui, HI, USA",
      propertyType: "Villa",
      price: 95000,
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      ratingsAverage: 4.9,
      ratingsQuantity: 145,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372344/wanderlust/listings/villa_maui_tropical.jpg", public_id: "wanderlust/listings/villa_maui_tropical" }
      ],
      amenities: ["Private Beach", "Tropical Garden", "Outdoor Kitchen", "Pool", "Snorkeling", "Surfboard"],
      isAvailable: true
    },
    {
      _id: "villa_5",
      title: "Costa Rica Rainforest Villa",
      description: "Eco-luxury villa nestled in Costa Rica's rainforest with wildlife viewing, canopy tours, and sustainable luxury amenities.",
      location: "Manuel Antonio, Costa Rica",
      propertyType: "Villa",
      price: 72000,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      ratingsAverage: 4.8,
      ratingsQuantity: 198,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372345/wanderlust/listings/villa_costarica_rainforest.jpg", public_id: "wanderlust/listings/villa_costarica_rainforest" }
      ],
      amenities: ["Rainforest Views", "Wildlife Viewing", "Eco-Friendly", "Canopy Tours", "Pool", "Full Kitchen"],
      isAvailable: true
    },

    // Apartments - 6 listings
    {
      _id: "apt_1",
      title: "Downtown Seattle Modern Apartment",
      description: "Sleek modern apartment in downtown Seattle with floor-to-ceiling windows, city views, and walking distance to Pike Place Market.",
      location: "Seattle, WA, USA",
      propertyType: "Apartment",
      price: 18500,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      ratingsAverage: 4.5,
      ratingsQuantity: 298,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372346/wanderlust/listings/apartment_seattle_modern.jpg", public_id: "wanderlust/listings/apartment_seattle_modern" }
      ],
      amenities: ["City Views", "Modern Design", "Full Kitchen", "WiFi", "Gym Access", "Parking"],
      isAvailable: true
    },
    {
      _id: "apt_2",
      title: "Brooklyn Heights Studio",
      description: "Charming studio apartment in trendy Brooklyn with exposed brick, high ceilings, and easy access to Manhattan.",
      location: "Brooklyn, NY, USA",
      propertyType: "Apartment",
      price: 12500,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.3,
      ratingsQuantity: 456,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372347/wanderlust/listings/apartment_brooklyn_studio.jpg", public_id: "wanderlust/listings/apartment_brooklyn_studio" }
      ],
      amenities: ["Exposed Brick", "High Ceilings", "Kitchenette", "WiFi", "Laundry", "Local Cafes"],
      isAvailable: true
    },
    {
      _id: "apt_3",
      title: "Chicago Loop Penthouse",
      description: "Luxury penthouse apartment with private terrace, panoramic city views, and premium amenities in Chicago's Loop district.",
      location: "Chicago, IL, USA",
      propertyType: "Apartment",
      price: 42500,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      ratingsAverage: 4.8,
      ratingsQuantity: 167,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372348/wanderlust/listings/apartment_chicago_penthouse.jpg", public_id: "wanderlust/listings/apartment_chicago_penthouse" }
      ],
      amenities: ["Private Terrace", "City Views", "Luxury Finishes", "Concierge", "Gym", "Rooftop Pool"],
      isAvailable: true
    },
    {
      _id: "apt_4",
      title: "San Francisco Loft",
      description: "Industrial loft apartment with exposed brick walls, high ceilings, and artistic flair in SF's vibrant arts district.",
      location: "San Francisco, CA, USA",
      propertyType: "Apartment",
      price: 28500,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      ratingsAverage: 4.6,
      ratingsQuantity: 234,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372349/wanderlust/listings/apartment_sf_loft.jpg", public_id: "wanderlust/listings/apartment_sf_loft" }
      ],
      amenities: ["Exposed Brick", "High Ceilings", "Arts District", "Full Kitchen", "WiFi", "Bike Storage"],
      isAvailable: true
    },
    {
      _id: "apt_5",
      title: "Miami Beach Art Deco Apartment",
      description: "Stylish apartment in an iconic Art Deco building with ocean views, vintage charm, and South Beach lifestyle.",
      location: "Miami Beach, FL, USA",
      propertyType: "Apartment",
      price: 24000,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.4,
      ratingsQuantity: 189,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372351/wanderlust/listings/apartment_miami_artdeco.jpg", public_id: "wanderlust/listings/apartment_miami_artdeco" }
      ],
      amenities: ["Ocean Views", "Art Deco Style", "Beach Access", "Pool", "WiFi", "Vintage Charm"],
      isAvailable: true
    },
    {
      _id: "apt_6",
      title: "Boston Back Bay Victorian",
      description: "Elegant apartment in a historic Victorian brownstone with period details, modern amenities, and tree-lined street views.",
      location: "Boston, MA, USA",
      propertyType: "Apartment",
      price: 21500,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 3,
      ratingsAverage: 4.6,
      ratingsQuantity: 156,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372352/wanderlust/listings/apartment_boston_victorian.jpg", public_id: "wanderlust/listings/apartment_boston_victorian" }
      ],
      amenities: ["Historic Character", "High Ceilings", "Hardwood Floors", "Full Kitchen", "WiFi", "Garden"],
      isAvailable: true
    },

    // Cottages - 5 listings
    {
      _id: "cottage_1",
      title: "English Cotswolds Thatched Cottage",
      description: "Charming 16th-century thatched cottage with rose gardens, countryside views, and authentic English countryside experience.",
      location: "Chipping Campden, UK",
      propertyType: "Cottage",
      price: 19500,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.6,
      ratingsQuantity: 234,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372353/wanderlust/listings/cottage_cotswolds_thatched.jpg", public_id: "wanderlust/listings/cottage_cotswolds_thatched" }
      ],
      amenities: ["Thatched Roof", "Rose Garden", "Fireplace", "Country Walks", "Pet Friendly", "Historic Character"],
      isAvailable: true
    },
    {
      _id: "cottage_2",
      title: "Muskoka Lakeside Log Cottage",
      description: "Rustic log cottage on pristine Muskoka lake with private dock, canoe, and spectacular Canadian wilderness sunsets.",
      location: "Muskoka, ON, Canada",
      propertyType: "Cottage",
      price: 22500,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      ratingsAverage: 4.7,
      ratingsQuantity: 189,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372353/wanderlust/listings/cottage_muskoka_lakeside.jpg", public_id: "wanderlust/listings/cottage_muskoka_lakeside" }
      ],
      amenities: ["Lakefront", "Private Dock", "Canoe", "Fireplace", "BBQ", "Wildlife Viewing"],
      isAvailable: true
    },
    {
      _id: "cottage_3",
      title: "Asheville Mountain Cabin",
      description: "Cozy mountain cottage surrounded by Blue Ridge Mountains with hiking trails, hot tub, and rustic mountain charm.",
      location: "Asheville, NC, USA",
      propertyType: "Cottage",
      price: 16500,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.5,
      ratingsQuantity: 156,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372354/wanderlust/listings/cottage_asheville_mountain.jpg", public_id: "wanderlust/listings/cottage_asheville_mountain" }
      ],
      amenities: ["Mountain Views", "Hot Tub", "Hiking Trails", "Fireplace", "Full Kitchen", "Wildlife"],
      isAvailable: true
    },
    {
      _id: "cottage_4",
      title: "Irish Countryside Stone Cottage",
      description: "Traditional Irish stone cottage with meadow views, sheep pastures, and authentic Celtic countryside experience.",
      location: "County Cork, Ireland",
      propertyType: "Cottage",
      price: 18000,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.8,
      ratingsQuantity: 203,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372355/wanderlust/listings/cottage_ireland_stone.jpg", public_id: "wanderlust/listings/cottage_ireland_stone" }
      ],
      amenities: ["Stone Construction", "Meadow Views", "Traditional Irish", "Fireplace", "Garden", "Local Pub"],
      isAvailable: true
    },
    {
      _id: "cottage_5",
      title: "Vermont Maple Farm Cottage",
      description: "Charming cottage on a working maple farm with maple syrup tastings, farm tours, and spectacular fall foliage views.",
      location: "Stowe, VT, USA",
      propertyType: "Cottage",
      price: 20000,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.7,
      ratingsQuantity: 178,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372356/wanderlust/listings/cottage_vermont_maple.jpg", public_id: "wanderlust/listings/cottage_vermont_maple" }
      ],
      amenities: ["Maple Farm", "Syrup Tastings", "Farm Tours", "Fall Foliage", "Full Kitchen", "Skiing Nearby"],
      isAvailable: true
    },

    // Hostels - 5 listings
    {
      _id: "hostel_1",
      title: "Amsterdam Central Backpacker Hub",
      description: "Modern hostel in Amsterdam's historic center with shared kitchen, common areas, bike rentals, and canal views.",
      location: "Amsterdam, Netherlands",
      propertyType: "Hostel",
      price: 3500,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 1,
      ratingsAverage: 4.2,
      ratingsQuantity: 567,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372357/wanderlust/listings/hostel_amsterdam_central.jpg", public_id: "wanderlust/listings/hostel_amsterdam_central" }
      ],
      amenities: ["Shared Kitchen", "Bike Rentals", "Canal Views", "WiFi", "Lockers", "24/7 Reception"],
      isAvailable: true
    },
    {
      _id: "hostel_2",
      title: "Byron Bay Surf Hostel",
      description: "Laid-back beachfront hostel with surfboard rentals, beach volleyball, yoga classes, and the ultimate Australian surf experience.",
      location: "Byron Bay, Australia",
      propertyType: "Hostel",
      price: 4200,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 1,
      ratingsAverage: 4.4,
      ratingsQuantity: 345,
      images: [
        { url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800", public_id: "hostel_byron_surf" }
      ],
      amenities: ["Surfboard Rentals", "Beach Volleyball", "Yoga Classes", "Common Kitchen", "WiFi", "Beach Access"],
      isAvailable: true
    },
    {
      _id: "hostel_3",
      title: "Interlaken Adventure Base",
      description: "Adventure-focused hostel with equipment rentals, guided tours, and stunning Alpine views in Switzerland's adventure capital.",
      location: "Interlaken, Switzerland",
      propertyType: "Hostel",
      price: 4500,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 1,
      ratingsAverage: 4.3,
      ratingsQuantity: 289,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372359/wanderlust/listings/hostel_interlaken_adventure.jpg", public_id: "wanderlust/listings/hostel_interlaken_adventure" }
      ],
      amenities: ["Adventure Tours", "Equipment Rental", "Alpine Views", "Shared Kitchen", "WiFi", "Ski Storage"],
      isAvailable: true
    },
    {
      _id: "hostel_4",
      title: "Tokyo Capsule Hostel",
      description: "Ultra-modern capsule hostel in Tokyo with high-tech pods, rooftop terrace, and immersive Japanese cultural experience.",
      location: "Tokyo, Japan",
      propertyType: "Hostel",
      price: 3800,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 1,
      ratingsAverage: 4.1,
      ratingsQuantity: 412,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372360/wanderlust/listings/hostel_tokyo_capsule.jpg", public_id: "wanderlust/listings/hostel_tokyo_capsule" }
      ],
      amenities: ["Capsule Beds", "High-Tech", "Rooftop Terrace", "Cultural Tours", "WiFi", "Shared Bath"],
      isAvailable: true
    },
    {
      _id: "hostel_5",
      title: "Barcelona Gothic Quarter Hostel",
      description: "Historic hostel in Barcelona's Gothic Quarter with medieval architecture, tapas tours, and vibrant nightlife access.",
      location: "Barcelona, Spain",
      propertyType: "Hostel",
      price: 3200,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 1,
      ratingsAverage: 4.0,
      ratingsQuantity: 523,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372361/wanderlust/listings/hostel_barcelona_gothic.jpg", public_id: "wanderlust/listings/hostel_barcelona_gothic" }
      ],
      amenities: ["Gothic Architecture", "Tapas Tours", "Nightlife Access", "Shared Kitchen", "WiFi", "Laundry"],
      isAvailable: true
    },

    // Guesthouses - 5 listings
    {
      _id: "guesthouse_1",
      title: "Traditional Kyoto Family Ryokan",
      description: "Authentic family-run ryokan with tatami rooms, home-cooked kaiseki meals, tea ceremony, and traditional Japanese hospitality.",
      location: "Kyoto, Japan",
      propertyType: "Guesthouse",
      price: 8500,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.8,
      ratingsQuantity: 234,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372362/wanderlust/listings/guesthouse_kyoto_ryokan.jpg", public_id: "wanderlust/listings/guesthouse_kyoto_ryokan" }
      ],
      amenities: ["Tatami Rooms", "Kaiseki Meals", "Tea Ceremony", "Garden", "Cultural Experience", "Yukata"],
      isAvailable: true
    },
    {
      _id: "guesthouse_2",
      title: "Alpine Swiss Chalet Guesthouse",
      description: "Cozy mountain guesthouse with spectacular Alpine views, hiking trail access, and hearty Swiss breakfast.",
      location: "Interlaken, Switzerland",
      propertyType: "Guesthouse",
      price: 16500,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.6,
      ratingsQuantity: 156,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372363/wanderlust/listings/guesthouse_swiss_alpine.jpg", public_id: "wanderlust/listings/guesthouse_swiss_alpine" }
      ],
      amenities: ["Alpine Views", "Hiking Access", "Swiss Breakfast", "Ski Storage", "WiFi", "Mountain Guides"],
      isAvailable: true
    },
    {
      _id: "guesthouse_3",
      title: "Cornish Coastal Guesthouse",
      description: "Charming coastal guesthouse with ocean views, fresh seafood breakfast, cliff walks, and authentic Cornish hospitality.",
      location: "Cornwall, UK",
      propertyType: "Guesthouse",
      price: 12500,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 3,
      ratingsAverage: 4.7,
      ratingsQuantity: 178,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372364/wanderlust/listings/guesthouse_cornwall_coastal.jpg", public_id: "wanderlust/listings/guesthouse_cornwall_coastal" }
      ],
      amenities: ["Ocean Views", "Fresh Seafood", "Cliff Walks", "Garden", "Local Hospitality", "WiFi"],
      isAvailable: true
    },
    {
      _id: "guesthouse_4",
      title: "Provence Lavender Farm Guesthouse",
      description: "Romantic guesthouse surrounded by lavender fields with French country breakfast, wine tastings, and Provence charm.",
      location: "Provence, France",
      propertyType: "Guesthouse",
      price: 14000,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.9,
      ratingsQuantity: 167,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372365/wanderlust/listings/guesthouse_provence_lavender.jpg", public_id: "wanderlust/listings/guesthouse_provence_lavender" }
      ],
      amenities: ["Lavender Fields", "French Breakfast", "Wine Tasting", "Garden", "Cycling", "Cooking Classes"],
      isAvailable: true
    },
    {
      _id: "guesthouse_5",
      title: "New Zealand Farm Stay",
      description: "Working sheep farm guesthouse with farm activities, lamb feeding, horseback riding, and spectacular Southern Alps views.",
      location: "Queenstown, New Zealand",
      propertyType: "Guesthouse",
      price: 11000,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.5,
      ratingsQuantity: 142,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372366/wanderlust/listings/guesthouse_nz_farm.jpg", public_id: "wanderlust/listings/guesthouse_nz_farm" }
      ],
      amenities: ["Farm Activities", "Lamb Feeding", "Horseback Riding", "Alps Views", "Farm Breakfast", "WiFi"],
      isAvailable: true
    },

    // Motels - 5 listings
    {
      _id: "motel_1",
      title: "Route 66 Classic Motel Flagstaff",
      description: "Vintage roadside motel with retro charm, neon signs, convenient highway access, and classic Americana atmosphere.",
      location: "Flagstaff, AZ, USA",
      propertyType: "Motel",
      price: 7500,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.1,
      ratingsQuantity: 298,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372367/wanderlust/listings/motel_route66_flagstaff.jpg", public_id: "wanderlust/listings/motel_route66_flagstaff" }
      ],
      amenities: ["Retro Charm", "Neon Signs", "Free Parking", "WiFi", "Continental Breakfast", "Pet Friendly"],
      isAvailable: true
    },
    {
      _id: "motel_2",
      title: "Desert Highway Motel Barstow",
      description: "Clean, comfortable motel perfect for road trips with easy highway access, basic amenities, and affordable rates.",
      location: "Barstow, CA, USA",
      propertyType: "Motel",
      price: 6500,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 3.9,
      ratingsQuantity: 234,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372369/wanderlust/listings/motel_barstow_highway.jpg", public_id: "wanderlust/listings/motel_barstow_highway" }
      ],
      amenities: ["Highway Access", "Free Parking", "24hr Reception", "WiFi", "Vending Machines", "Air Conditioning"],
      isAvailable: true
    },
    {
      _id: "motel_3",
      title: "Texas Longhorn Motel",
      description: "Authentic Texas motel with cowboy decor, BBQ restaurant, and true Lone Star State hospitality experience.",
      location: "Amarillo, TX, USA",
      propertyType: "Motel",
      price: 8000,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.2,
      ratingsQuantity: 187,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372370/wanderlust/listings/motel_texas_longhorn.jpg", public_id: "wanderlust/listings/motel_texas_longhorn" }
      ],
      amenities: ["Cowboy Decor", "BBQ Restaurant", "Free Parking", "Pool", "WiFi", "Texas Hospitality"],
      isAvailable: true
    },
    {
      _id: "motel_4",
      title: "Pacific Coast Motel",
      description: "Oceanside motel with beach access, surf board rentals, and spectacular California coastline views.",
      location: "Monterey, CA, USA",
      propertyType: "Motel",
      price: 11000,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.3,
      ratingsQuantity: 245,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372371/wanderlust/listings/motel_pacific_coast.jpg", public_id: "wanderlust/listings/motel_pacific_coast" }
      ],
      amenities: ["Beach Access", "Ocean Views", "Surf Board Rentals", "Free Parking", "WiFi", "Continental Breakfast"],
      isAvailable: true
    },
    {
      _id: "motel_5",
      title: "Mountain View Motel Colorado",
      description: "Family-friendly motel with stunning Rocky Mountain views, ski equipment storage, and easy access to outdoor activities.",
      location: "Vail, CO, USA",
      propertyType: "Motel",
      price: 9500,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.0,
      ratingsQuantity: 156,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372372/wanderlust/listings/motel_colorado_mountain.jpg", public_id: "wanderlust/listings/motel_colorado_mountain" }
      ],
      amenities: ["Mountain Views", "Ski Storage", "Family Friendly", "Free Parking", "WiFi", "Hot Tub"],
      isAvailable: true
    },

    // Bungalows - 5 listings
    {
      _id: "bungalow_1",
      title: "Bora Bora Overwater Bungalow",
      description: "Luxury overwater bungalow with direct lagoon access, glass floor panels, and unparalleled views of Mount Otemanu.",
      location: "Bora Bora, French Polynesia",
      propertyType: "Bungalow",
      price: 95000,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.9,
      ratingsQuantity: 78,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372373/wanderlust/listings/bungalow_borabora_overwater.jpg", public_id: "wanderlust/listings/bungalow_borabora_overwater" }
      ],
      amenities: ["Overwater", "Glass Floor", "Lagoon Access", "Snorkeling", "Private Deck", "Sunset Views"],
      isAvailable: true
    },
    {
      _id: "bungalow_2",
      title: "Bali Jungle Garden Bungalow",
      description: "Secluded tropical bungalow surrounded by lush Balinese gardens with outdoor shower, yoga pavilion, and spa access.",
      location: "Ubud, Bali, Indonesia",
      propertyType: "Bungalow",
      price: 14500,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.7,
      ratingsQuantity: 189,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372374/wanderlust/listings/bungalow_bali_jungle.jpg", public_id: "wanderlust/listings/bungalow_bali_jungle" }
      ],
      amenities: ["Jungle Garden", "Outdoor Shower", "Yoga Pavilion", "Spa Access", "Private Terrace", "Rice Field Views"],
      isAvailable: true
    },
    {
      _id: "bungalow_3",
      title: "Tulum Beach Bungalow",
      description: "Eco-chic beach bungalow steps from white sand beaches with hammock, cenote access, and authentic Mexican Caribbean vibe.",
      location: "Tulum, Mexico",
      propertyType: "Bungalow",
      price: 28500,
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      ratingsAverage: 4.6,
      ratingsQuantity: 145,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372375/wanderlust/listings/bungalow_tulum_beach.jpg", public_id: "wanderlust/listings/bungalow_tulum_beach" }
      ],
      amenities: ["Beach Access", "Hammock", "Cenote Tours", "Snorkeling", "Eco-Friendly", "Beach Chairs"],
      isAvailable: true
    },
    {
      _id: "bungalow_4",
      title: "African Safari Bungalow",
      description: "Luxury safari bungalow with wildlife views, game drives, and authentic African bush experience in Kruger National Park.",
      location: "Kruger National Park, South Africa",
      propertyType: "Bungalow",
      price: 35000,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      ratingsAverage: 4.8,
      ratingsQuantity: 112,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372376/wanderlust/listings/bungalow_safari_kruger.jpg", public_id: "wanderlust/listings/bungalow_safari_kruger" }
      ],
      amenities: ["Wildlife Views", "Game Drives", "Safari Tours", "Private Deck", "Full Kitchen", "Nature Walks"],
      isAvailable: true
    },
    {
      _id: "bungalow_5",
      title: "Maldives Sunset Beach Bungalow",
      description: "Romantic beach bungalow with private beach section, snorkeling reef access, and spectacular Indian Ocean sunsets.",
      location: "Maldives, Indian Ocean",
      propertyType: "Bungalow",
      price: 75000,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      ratingsAverage: 4.9,
      ratingsQuantity: 98,
      images: [
        { url: "https://res.cloudinary.com/dorog1f6r/image/upload/v1758372377/wanderlust/listings/bungalow_maldives_sunset.jpg", public_id: "wanderlust/listings/bungalow_maldives_sunset" }
      ],
      amenities: ["Private Beach", "Snorkeling Reef", "Sunset Views", "Water Sports", "Spa Access", "Fine Dining"],
      isAvailable: true
    }
  ];
};

export default {
  PROPERTY_CATEGORIES,
  fetchAllListings,
  getListingsByCategory,
  getCategoryListings,
  getCategoryInfo,
  getFeaturedListings,
  getMockListings
};