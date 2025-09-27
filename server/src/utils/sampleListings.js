// sampleListings.js
import mongoose from "mongoose";


const hostId = new mongoose.Types.ObjectId();

const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    location: "Malibu, United States",
    price: 1500,
    images: [
      {
        url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?...",
        public_id: "listingimage",
      },
    ],
    amenities: ["WiFi", "Air Conditioning", "Parking"],
    propertyType: "Cottage",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    host: hostId,
    ratingsAverage: 0,
    ratingsQuantity: 0,
    isAvailable: true,
  },
  {
    title: "Modern Loft in Downtown",
    description: "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    location: "New York City, United States",
    price: 1200,
    images: [
      {
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?...",
        public_id: "listingimage",
      },
    ],
    amenities: ["WiFi", "Kitchen", "Elevator"],
    propertyType: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    host: hostId,
    ratingsAverage: 0,
    ratingsQuantity: 0,
    isAvailable: true,
  },
  {
    title: "Mountain Retreat",
    description: "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    location: "Aspen, United States",
    price: 1000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?...",
        public_id: "listingimage",
      },
    ],
    amenities: ["Fireplace", "Parking", "Balcony"],
    propertyType: "Cabin",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    host: hostId,
    ratingsAverage: 0,
    ratingsQuantity: 0,
    isAvailable: true,
  },
  {
    title: "Luxury Villa with Private Pool",
    description: "Indulge in luxury at this stunning villa with a private pool and breathtaking views of the Mediterranean.",
    location: "Santorini, Greece",
    price: 5000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?...",
        public_id: "listingimage",
      },
    ],
    amenities: ["Pool", "WiFi", "Air Conditioning", "Parking"],
    propertyType: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    host: hostId,
    ratingsAverage: 0,
    ratingsQuantity: 0,
    isAvailable: true,
  },
  {
    title: "Rustic Countryside Farmhouse",
    description: "Experience the charm of the countryside in this spacious farmhouse surrounded by rolling hills and farmland.",
    location: "Tuscany, Italy",
    price: 800,
    images: [
      {
        url: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?...",
        public_id: "listingimage",
      },
    ],
    amenities: ["Garden", "Parking", "Kitchen"],
    propertyType: "Farmhouse",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    host: hostId,
    ratingsAverage: 0,
    ratingsQuantity: 0,
    isAvailable: true,
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    description: "Hit the slopes directly from this cozy ski-in/ski-out chalet in the Swiss Alps. Perfect for winter sports enthusiasts.",
    location: "Zermatt, Switzerland",
    price: 3000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?...",
        public_id: "listingimage",
      },
    ],
    amenities: ["Fireplace", "WiFi", "Ski Access"],
    propertyType: "Chalet",
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    host: hostId,
    ratingsAverage: 0,
    ratingsQuantity: 0,
    isAvailable: true,
  },
  {
    title: "Desert Oasis Glamping",
    description: "Discover the magic of the desert with a unique glamping experience. Sleep under the stars in comfort.",
    location: "Wadi Rum, Jordan",
    price: 600,
    images: [
      {
        url: "https://images.unsplash.com/photo-1469796466635-455ede028aca?...",
        public_id: "listingimage",
      },
    ],
    amenities: ["Outdoor Seating", "Bonfire", "Guided Tours"],
    propertyType: "Tent",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    host: hostId,
    ratingsAverage: 0,
    ratingsQuantity: 0,
    isAvailable: true,
  },
  {
    title: "Historic Castle Stay",
    description: "Live like royalty in this beautifully restored medieval castle with modern amenities.",
    location: "Edinburgh, Scotland",
    price: 7000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?...",
        public_id: "listingimage",
      },
    ],
    amenities: ["WiFi", "Banquet Hall", "Garden"],
    propertyType: "Castle",
    bedrooms: 10,
    bathrooms: 8,
    maxGuests: 20,
    host: hostId,
    ratingsAverage: 0,
    ratingsQuantity: 0,
    isAvailable: true,
  },
  {
    title: "Jungle Treehouse Adventure",
    description: "Stay high above the ground in this unique treehouse surrounded by tropical rainforest.",
    location: "Bali, Indonesia",
    price: 900,
    images: [
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?...",
        public_id: "listingimage",
      },
    ],
    amenities: ["Balcony", "Outdoor Shower", "Breakfast Included"],
    propertyType: "Treehouse",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    host: hostId,
    ratingsAverage: 0,
    ratingsQuantity: 0,
    isAvailable: true,
  },
  {
    title: "Houseboat on Serene Lake",
    description: "Float away in this charming houseboat, offering a peaceful retreat with stunning lake views.",
    location: "Kashmir, India",
    price: 1100,
    images: [
      {
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?...",
        public_id: "listingimage",
      },
    ],
    amenities: ["Lake View", "WiFi", "Kitchen"],
    propertyType: "Houseboat",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 5,
    host: hostId,
    ratingsAverage: 0,
    ratingsQuantity: 0,
    isAvailable: true,
  },
  {
    "title": "Chic Parisian Apartment with Eiffel Tower View",
    "description": "Experience the magic of Paris in this elegant apartment. Enjoy breathtaking views of the Eiffel Tower from your private balcony. Close to cafes and boutiques.",
    "location": "Paris, France",
    "price": 275,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1502602898657-3e91760c0337?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_paris_1"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Elevator", "City View"],
    "propertyType": "Apartment",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_1",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 134,
    "isAvailable": true
  },
  {
    "title": "Serene Mountain Chalet in the Alps",
    "description": "A cozy retreat nestled in the Swiss Alps. Perfect for skiing in the winter or hiking in the summer. Features a warm fireplace and stunning mountain views.",
    "location": "Grindelwald, Switzerland",
    "price": 450,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1593739742339-c5b60cf187b5?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_alps_1"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Fireplace", "Parking", "Mountain View"],
    "propertyType": "Chalet",
    "bedrooms": 3,
    "bathrooms": 2,
    "maxGuests": 6,
    "host": "hostId_2",
    "ratingsAverage": 4.95,
    "ratingsQuantity": 98,
    "isAvailable": true
  },
  {
    "title": "Luxury Villa with Infinity Pool",
    "description": "Indulge in this breathtaking villa in Bali. Featuring a private infinity pool overlooking the jungle, it's the ultimate tropical escape.",
    "location": "Ubud, Bali, Indonesia",
    "price": 700,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_bali_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Kitchen", "Parking"],
    "propertyType": "Villa",
    "bedrooms": 4,
    "bathrooms": 4,
    "maxGuests": 8,
    "host": "hostId_3",
    "ratingsAverage": 5.0,
    "ratingsQuantity": 210,
    "isAvailable": false
  },
  {
    "title": "Historic Townhouse in Central London",
    "description": "Stay in a beautifully restored Georgian townhouse in the heart of London. Steps away from museums, theaters, and famous landmarks.",
    "location": "London, United Kingdom",
    "price": 350,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1529655683826-1c21ef24a42b?auto=format&fit=crop&q=80&w=1972",
        "public_id": "listingimage_london_1"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Washer", "Dryer", "TV"],
    "propertyType": "Townhouse",
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "host": "hostId_4",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 88,
    "isAvailable": true
  },
  {
    "title": "Minimalist Studio in Shibuya",
    "description": "A sleek and modern studio apartment in the vibrant Shibuya district of Tokyo. Perfect for solo travelers or couples wanting to explore the city.",
    "location": "Tokyo, Japan",
    "price": 180,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_tokyo_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Kitchenette", "Elevator"],
    "propertyType": "Studio",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_5",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 250,
    "isAvailable": true
  },
  {
    "title": "Riverside Cabin Getaway",
    "description": "Unplug and unwind in this rustic cabin on the river. Enjoy fishing, kayaking, and evenings by the fire pit.",
    "location": "Asheville, United States",
    "price": 220,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1570793005389-695315839933?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_cabin_1"
      }
    ],
    "amenities": ["Kitchen", "Fireplace", "Parking", "Pet Friendly"],
    "propertyType": "Cabin",
    "bedrooms": 2,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_6",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 115,
    "isAvailable": true
  },
  {
    "title": "Roman Penthouse near the Colosseum",
    "description": "Live like an emperor in this luxurious penthouse with a private terrace offering stunning views of ancient Rome.",
    "location": "Rome, Italy",
    "price": 550,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1529156069898-fac519342c6c?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_rome_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Hot Tub", "Elevator", "City View"],
    "propertyType": "Penthouse",
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "host": "hostId_7",
    "ratingsAverage": 4.85,
    "ratingsQuantity": 72,
    "isAvailable": true
  },
  {
    "title": "Bohemian Bungalow in Goa",
    "description": "A charming and colorful bungalow just minutes from Anjuna beach. Perfect for a relaxed and vibrant holiday.",
    "location": "Goa, India",
    "price": 90,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1595923485590-ba38f06a12a5?auto=format&fit=crop&q=80&w=1931",
        "public_id": "listingimage_goa_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Parking", "Kitchen"],
    "propertyType": "Bungalow",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 3,
    "host": "hostId_8",
    "ratingsAverage": 4.6,
    "ratingsQuantity": 155,
    "isAvailable": true
  },
  {
    "title": "Sydney Harbour View Apartment",
    "description": "Wake up to iconic views of the Sydney Opera House and Harbour Bridge from this stylish, modern apartment.",
    "location": "Sydney, Australia",
    "price": 400,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1524293581274-1a37de296c21?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_sydney_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Gym", "City View"],
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "host": "hostId_9",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 102,
    "isAvailable": false
  },
  {
    "title": "Desert Oasis with Pool",
    "description": "Escape the heat in this beautiful desert home. Features a refreshing pool and stunning sunset views.",
    "location": "Scottsdale, United States",
    "price": 380,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_desert_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Parking", "Hot Tub"],
    "propertyType": "House",
    "bedrooms": 3,
    "bathrooms": 3,
    "maxGuests": 8,
    "host": "hostId_10",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 64,
    "isAvailable": true
  },
  {
    "title": "Santorini Cave House with Caldera View",
    "description": "A traditional, whitewashed cave house in Oia with a private hot tub and unforgettable views of the caldera.",
    "location": "Santorini, Greece",
    "price": 650,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1533105079780-52b9be4ac20c?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_santorini_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Hot Tub", "Kitchenette"],
    "propertyType": "Cave House",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_11",
    "ratingsAverage": 5.0,
    "ratingsQuantity": 180,
    "isAvailable": true
  },
  {
    "title": "Artistic Loft in Berlin",
    "description": "A spacious and light-filled loft in the creative heart of Berlin. Surrounded by galleries, cafes, and street art.",
    "location": "Berlin, Germany",
    "price": 190,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_berlin_1"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Elevator", "Washer"],
    "propertyType": "Loft",
    "bedrooms": 2,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_12",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 99,
    "isAvailable": true
  },
  {
    "title": "Charming Cotswolds Cottage with Garden",
    "description": "Escape to this idyllic stone cottage in the heart of the English countryside. Features a cozy fireplace, a beautiful private garden, and easy access to scenic walking trails.",
    "location": "Cotswolds, United Kingdom",
    "price": 250,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1600585153442-5edc343411b4?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_cotswolds_1"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Fireplace", "Parking", "Garden"],
    "propertyType": "Cottage",
    "bedrooms": 2,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_21",
    "ratingsAverage": 4.95,
    "ratingsQuantity": 112,
    "isAvailable": true
  },
  {
    "title": "Lakeside Retreat in Muskoka",
    "description": "A classic Canadian cottage experience right on the water. Enjoy swimming off the private dock, canoeing at sunset, and evenings by the fire pit.",
    "location": "Muskoka, Canada",
    "price": 310,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1934",
        "public_id": "listingimage_muskoka_2"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Waterfront", "Fire Pit", "Canoe"],
    "propertyType": "Cottage",
    "bedrooms": 3,
    "bathrooms": 2,
    "maxGuests": 6,
    "host": "hostId_22",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 95,
    "isAvailable": true
  },
  {
    "title": "Himalayan Hideaway Cottage",
    "description": "Nestled in the hills near Shimla, this cozy wooden cottage offers breathtaking views of the Himalayas. Perfect for a peaceful retreat, trekking, and escaping the city.",
    "location": "Shimla, India",
    "price": 120,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1616035945138-5963734f0b28?auto=format&fit=crop&q=80&w=1974",
        "public_id": "listingimage_shimla_1"
      }
    ],
    "amenities": ["WiFi", "Kitchenette", "Heating", "Mountain View", "Parking"],
    "propertyType": "Cottage",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 3,
    "host": "hostId_23",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 150,
    "isAvailable": false
  },
  {
    "title": "Quaint Cornish Seaside Cottage",
    "description": "A bright and airy cottage just a short walk from the stunning Cornish coast. Ideal for beach lovers, surfers, and exploring charming fishing villages.",
    "location": "Cornwall, United Kingdom",
    "price": 220,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1570160431388-36a60e11820b?auto=format&fit=crop&q=80&w=1974",
        "public_id": "listingimage_cornwall_1"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Washer", "Parking", "Beach Access"],
    "propertyType": "Cottage",
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "host": "hostId_24",
    "ratingsAverage": 4.75,
    "ratingsQuantity": 88,
    "isAvailable": true
  },
  {
    "title": "Romantic Vineyard Cottage in Provence",
    "description": "Stay in a beautifully restored cottage surrounded by the vineyards of Provence. Perfect for wine tasting, cycling through the countryside, and enjoying local markets.",
    "location": "Provence, France",
    "price": 280,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1599684428232-b649b5883654?auto=format&fit=crop&q=80&w=2062",
        "public_id": "listingimage_provence_2"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Kitchenette", "Patio"],
    "propertyType": "Cottage",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_25",
    "ratingsAverage": 5.0,
    "ratingsQuantity": 105,
    "isAvailable": true
  },
  {
    "title": "The Grand Cityscape Hotel",
    "description": "Experience luxury in the heart of the metropolis. Our hotel offers stunning city views, a rooftop pool, and is steps away from the city's main attractions and business district.",
    "location": "New York, United States",
    "price": 450,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_hotel_nyc_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Room Service", "Gym", "Concierge"],
    "propertyType": "Hotel",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_26",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 1258,
    "isAvailable": true
  },
  {
    "title": "Paradise Cove All-Inclusive Resort & Spa",
    "description": "Discover a tropical paradise where everything is included. Enjoy pristine white-sand beaches, gourmet dining, infinity pools, and a full-service spa. Perfect for romantic getaways and family fun.",
    "location": "Punta Cana, Dominican Republic",
    "price": 650,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_resort_puntacana_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Spa", "All-Inclusive", "Beach Access", "Kids Club"],
    "propertyType": "Resort",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_31",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 2150,
    "isAvailable": true
  },
  {
    "title": "Eagle Ridge Mountain & Golf Resort",
    "description": "Nestled in the heart of the Rocky Mountains, our resort offers year-round activities. Hit the slopes in winter, play a round on our championship golf course in summer, or relax by the grand lodge fireplace.",
    "location": "Vail, United States",
    "price": 520,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1595526051245-55d85d354c37?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_resort_vail_1"
      }
    ],
    "amenities": ["WiFi", "Heating", "Pool", "Hot Tub", "Golf Course", "Ski-In/Ski-Out", "Restaurant"],
    "propertyType": "Resort",
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 6,
    "host": "hostId_32",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 890,
    "isAvailable": true
  },
  {
    "title": "Serenity Bay Luxury Wellness Resort",
    "description": "A tranquil sanctuary dedicated to your well-being. Our adults-only resort focuses on holistic wellness with daily yoga, meditation classes, organic cuisine, and rejuvenating spa treatments.",
    "location": "Ubud, Bali, Indonesia",
    "price": 480,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1996",
        "public_id": "listingimage_resort_bali_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Spa", "Yoga Studio", "Restaurant", "Adults-Only"],
    "propertyType": "Resort",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_33",
    "ratingsAverage": 5.0,
    "ratingsQuantity": 1340,
    "isAvailable": true
  },
  {
    "title": "Coral Reef Family Adventure Resort",
    "description": "The ultimate family vacation destination! Our resort features a massive water park, a protected coral reef for snorkeling, supervised kids' activities, and entertainment for all ages.",
    "location": "Gold Coast, Australia",
    "price": 410,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_resort_goldcoast_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Water Park", "Beach Access", "Kids Club", "Game Room"],
    "propertyType": "Resort",
    "bedrooms": 2,
    "bathrooms": 1,
    "maxGuests": 5,
    "host": "hostId_34",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 1788,
    "isAvailable": false
  },
  {
    "title": "Desert Mirage Oasis & Casino Resort",
    "description": "An oasis of excitement and luxury in the desert. Try your luck at our vibrant casino, relax by the sprawling lagoon-style pools, and enjoy world-class shows and dining.",
    "location": "Las Vegas, United States",
    "price": 350,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1605338165378-82d46a8a716c?auto=format&fit=crop&q=80&w=2071",
        "public_id": "listingimage_resort_vegas_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Casino", "Restaurant", "Nightclub", "Show Theater"],
    "propertyType": "Resort",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_35",
    "ratingsAverage": 4.6,
    "ratingsQuantity": 3520,
    "isAvailable": true
  },
  {
    "title": "Ocean Breeze Beach Resort",
    "description": "Wake up to the sound of waves at our exclusive beachfront resort. Enjoy private beach access, a world-class spa, and multiple fine dining options.",
    "location": "Cancun, Mexico",
    "price": 380,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_hotel_cancun_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Beach Access", "Spa", "Restaurant"],
    "propertyType": "Hotel",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 3,
    "host": "hostId_27",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 980,
    "isAvailable": true
  },
  {
    "title": "The Heritage Boutique Hotel",
    "description": "Stay in a beautifully restored historic building in the city's charming old town. Our boutique hotel combines timeless elegance with modern comfort.",
    "location": "Rome, Italy",
    "price": 290,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1780",
        "public_id": "listingimage_hotel_rome_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Room Service", "Bar", "Concierge"],
    "propertyType": "Hotel",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_28",
    "ratingsAverage": 4.85,
    "ratingsQuantity": 750,
    "isAvailable": true
  },
  {
    "title": "Alpine Peak Lodge",
    "description": "A cozy mountain lodge perfect for your ski vacation or summer hiking adventure. Features a stone fireplace in the lobby, a hot tub with mountain views, and ski-in/ski-out access.",
    "location": "Aspen, United States",
    "price": 550,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1542314831-068cd1dbb563?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_hotel_aspen_1"
      }
    ],
    "amenities": ["WiFi", "Heating", "Hot Tub", "Restaurant", "Ski Storage", "Parking"],
    "propertyType": "Hotel",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_29",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 620,
    "isAvailable": false
  },
  {
    "title": "Zen Garden Business Hotel",
    "description": "A tranquil oasis in the bustling city center. Designed for the modern traveler, our hotel features a serene Japanese garden, executive lounge, and state-of-the-art meeting facilities.",
    "location": "Tokyo, Japan",
    "price": 310,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1578680931914-9a4f6a59b5be?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_hotel_tokyo_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Gym", "Restaurant", "Business Center"],
    "propertyType": "Hotel",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_30",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 1120,
    "isAvailable": true
  },
  {
    "title": "Family Home near Disney World",
    "description": "The perfect base for your family's theme park adventure! This spacious home has a private pool and a game room.",
    "location": "Orlando, United States",
    "price": 320,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_orlando_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Parking", "Game Room"],
    "propertyType": "House",
    "bedrooms": 4,
    "bathrooms": 3,
    "maxGuests": 10,
    "host": "hostId_13",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 142,
    "isAvailable": true
  },
  {
    "title": "Lakeside Cottage in Muskoka",
    "description": "Classic Canadian cottage experience. Enjoy swimming, canoeing, and bonfires by the lake.",
    "location": "Muskoka, Canada",
    "price": 300,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1934",
        "public_id": "listingimage_muskoka_1"
      }
    ],
    "amenities": ["Kitchen", "Fireplace", "Parking", "Waterfront", "Canoe"],
    "propertyType": "Cottage",
    "bedrooms": 3,
    "bathrooms": 1,
    "maxGuests": 6,
    "host": "hostId_14",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 81,
    "isAvailable": true
  },
  {
    "title": "Stylish Flat in Barcelona's Gothic Quarter",
    "description": "Immerse yourself in history in this beautifully designed flat, located on a charming street in the Barri Gòtic.",
    "location": "Barcelona, Spain",
    "price": 210,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_barcelona_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Kitchen", "Elevator"],
    "propertyType": "Apartment",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 3,
    "host": "hostId_15",
    "ratingsAverage": 4.75,
    "ratingsQuantity": 167,
    "isAvailable": true
  },
  {
    "title": "Luxury Riad in Marrakech",
    "description": "Experience traditional Moroccan hospitality in this stunning Riad. Features a central courtyard pool and a rooftop terrace.",
    "location": "Marrakech, Morocco",
    "price": 250,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1559923835-85a5b51a117b?auto=format&fit=crop&q=80&w=1964",
        "public_id": "listingimage_marrakech_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Breakfast Included"],
    "propertyType": "Riad",
    "bedrooms": 3,
    "bathrooms": 3,
    "maxGuests": 6,
    "host": "hostId_16",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 94,
    "isAvailable": true
  },
  {
    "title": "Eco-Lodge in the Costa Rican Rainforest",
    "description": "Connect with nature in this sustainable eco-lodge. Wake up to the sounds of howler monkeys and toucans.",
    "location": "La Fortuna, Costa Rica",
    "price": 180,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&q=80&w=1974",
        "public_id": "listingimage_costarica_1"
      }
    ],
    "amenities": ["WiFi", "Parking", "Kitchenette", "Fan"],
    "propertyType": "Lodge",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_17",
    "ratingsAverage": 4.95,
    "ratingsQuantity": 230,
    "isAvailable": true
  },
  {
    "title": "Modern Apartment in Downtown Dubai",
    "description": "Sleek apartment with spectacular views of the Burj Khalifa. Access to a state-of-the-art gym and rooftop pool.",
    "location": "Dubai, UAE",
    "price": 420,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1512401511516-53896b0264f3?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_dubai_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Gym", "Parking"],
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 5,
    "host": "hostId_18",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 77,
    "isAvailable": false
  },
  {
    "title": "Canal House in Amsterdam",
    "description": "Stay in a charming, historic canal house in the Jordaan district. Watch the boats go by from your window.",
    "location": "Amsterdam, Netherlands",
    "price": 290,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1584022138986-1d18729e8a09?auto=format&fit=crop&q=80&w=1974",
        "public_id": "listingimage_amsterdam_1"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Heating", "Washer"],
    "propertyType": "House",
    "bedrooms": 2,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_19",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 132,
    "isAvailable": true
  },
  {
    "title": "The Lilly Pad Garden Guesthouse",
    "description": "A charming, family-run guesthouse set in a beautiful tropical garden. Enjoy home-cooked meals, personalized service, and a peaceful atmosphere just minutes from the beach.",
    "location": "Goa, India",
    "price": 80,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1593298188433-8a9d18b6222c?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_guesthouse_goa_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Free Breakfast", "Garden", "Parking"],
    "propertyType": "Guesthouse",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_36",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 215,
    "isAvailable": true
  },
  {
    "title": "Jaipur Haveli Homestay",
    "description": "Experience authentic Rajasthani hospitality in our traditional family haveli. Each room is uniquely decorated with local art. Join us for rooftop dinners with views of the old city.",
    "location": "Jaipur, India",
    "price": 65,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1626242632598-c58485a73e65?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_guesthouse_jaipur_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Home-cooked Meals", "Rooftop Terrace"],
    "propertyType": "Guesthouse",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 3,
    "host": "hostId_37",
    "ratingsAverage": 4.95,
    "ratingsQuantity": 350,
    "isAvailable": true
  },
  {
    "title": "O'Connell's Seaside Guesthouse",
    "description": "A traditional Irish guesthouse overlooking the Atlantic. Known for our warm welcome and famous full Irish breakfast. The perfect base for exploring the Wild Atlantic Way.",
    "location": "Dingle, Ireland",
    "price": 130,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1598740333912-a8913b48278d?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_guesthouse_ireland_1"
      }
    ],
    "amenities": ["WiFi", "Heating", "Free Breakfast", "Sea View", "Parking"],
    "propertyType": "Guesthouse",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_38",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 188,
    "isAvailable": true
  },
  {
    "title": "The Cape Dutch Guesthouse",
    "description": "Stay in a beautiful Cape Dutch-style house in the heart of the Winelands. Relax by the pool, explore the vineyards, and enjoy the stunning mountain scenery.",
    "location": "Stellenbosch, South Africa",
    "price": 150,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1628812224760-4a57b78587e9?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_guesthouse_sa_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Free Breakfast", "Parking"],
    "propertyType": "Guesthouse",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_39",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 165,
    "isAvailable": true
  },
  {
    "title": "Sakura Inn Guesthouse",
    "description": "A quiet and clean guesthouse offering a traditional Japanese experience with tatami mat rooms and futon beds. Located in a peaceful neighborhood, close to temples and gardens.",
    "location": "Kyoto, Japan",
    "price": 110,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1593976583996-8566e133127e?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_guesthouse_kyoto_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Shared Kitchen", "Bike Rental", "Luggage Storage"],
    "propertyType": "Guesthouse",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_40",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 420,
    "isAvailable": false
  },
  {
    "title": "Secluded Beachfront Bungalow",
    "description": "Your own private paradise. This bungalow is right on a quiet beach, perfect for a romantic getaway.",
    "location": "Phuket, Thailand",
    "price": 240,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1585544672597-c857404d031a?auto=format&fit=crop&q=80&w=1974",
        "public_id": "listingimage_phuket_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Beach Access", "Kitchenette"],
    "propertyType": "Bungalow",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_20",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 105,
    "isAvailable": true
  },
  {
    "title": "Grand Country House in Tuscany",
    "description": "A beautiful stone farmhouse set among rolling hills and vineyards. Features a large pool and outdoor dining area.",
    "location": "Tuscany, Italy",
    "price": 800,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1562624599-2228801b67f4?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_tuscany_1"
      }
    ],
    "amenities": ["WiFi", "Pool", "Kitchen", "Parking", "Fireplace"],
    "propertyType": "Villa",
    "bedrooms": 6,
    "bathrooms": 5,
    "maxGuests": 12,
    "host": "hostId_1",
    "ratingsAverage": 5.0,
    "ratingsQuantity": 89,
    "isAvailable": true
  },
  {
    "title": "Compact Studio in Hong Kong",
    "description": "An efficiently designed studio in the bustling heart of Central. The perfect spot for business or solo travel.",
    "location": "Hong Kong",
    "price": 150,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&q=80&w=1974",
        "public_id": "listingimage_hk_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Elevator", "Kitchenette"],
    "propertyType": "Studio",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_2",
    "ratingsAverage": 4.6,
    "ratingsQuantity": 211,
    "isAvailable": true
  },
  {
    "title": "Lakefront Cabin in Queenstown",
    "description": "Adventure awaits at this stunning cabin on Lake Wakatipu. Incredible views of The Remarkables mountain range.",
    "location": "Queenstown, New Zealand",
    "price": 350,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1506953823073-a725b83b38a2?auto=format&fit=crop&q=80&w=1974",
        "public_id": "listingimage_queenstown_1"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Parking", "Hot Tub", "Mountain View"],
    "propertyType": "Cabin",
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "host": "hostId_3",
    "ratingsAverage": 4.95,
    "ratingsQuantity": 150,
    "isAvailable": true
  },
  {
    "title": "Historic Apartment in Prague's Old Town",
    "description": "Stay right next to the Astronomical Clock in this charming apartment with original wooden beams and modern comforts.",
    "location": "Prague, Czech Republic",
    "price": 170,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1594234190443-4abd1450a8b3?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_prague_1"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Heating", "Washer"],
    "propertyType": "Apartment",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 3,
    "host": "hostId_4",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 198,
    "isAvailable": true
  },
  {
    "title": "Penthouse with Rooftop Pool",
    "description": "Live the high life in this stunning penthouse. Features a private rooftop pool and 360-degree city views.",
    "location": "Miami, United States",
    "price": 1200,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1599488846439-5282d5477069?auto=format&fit=crop&q=80&w=2071",
        "public_id": "listingimage_miami_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Hot Tub", "Gym"],
    "propertyType": "Penthouse",
    "bedrooms": 3,
    "bathrooms": 4,
    "maxGuests": 6,
    "host": "hostId_5",
    "ratingsAverage": 5.0,
    "ratingsQuantity": 45,
    "isAvailable": true
  },
  {
    "title": "Traditional Hanok Stay",
    "description": "Experience Korean culture in this beautiful traditional Hanok. Features a peaceful inner courtyard.",
    "location": "Seoul, South Korea",
    "price": 200,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1610212024793-956gyb45e7b3?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_seoul_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Heating", "Kitchenette"],
    "propertyType": "Hanok",
    "bedrooms": 2,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_6",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 112,
    "isAvailable": true
  },
  {
    "title": "Sunny Beach House in Cape Town",
    "description": "A bright and airy house just steps from Camps Bay beach, with stunning views of the Twelve Apostles.",
    "location": "Cape Town, South Africa",
    "price": 480,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1616175021873-c62f0a5f9353?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_capetown_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Beach Access", "Parking"],
    "propertyType": "House",
    "bedrooms": 4,
    "bathrooms": 3,
    "maxGuests": 8,
    "host": "hostId_7",
    "ratingsAverage": 4.85,
    "ratingsQuantity": 88,
    "isAvailable": true
  },
  {
    "title": "Houseboat on Kerala's Backwaters",
    "description": "A unique experience floating through the serene backwaters of Kerala on a private, fully-staffed houseboat.",
    "location": "Alleppey, India",
    "price": 180,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1593693397649-65d2a2c6d46a?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_kerala_1"
      }
    ],
    "amenities": ["Private Chef", "Air Conditioning", "Waterfront"],
    "propertyType": "Houseboat",
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "host": "hostId_8",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 176,
    "isAvailable": true
  },
  {
    "title": "Vineyard Estate in Napa Valley",
    "description": "Stay on a working vineyard in this elegant estate. Enjoy wine tasting and beautiful views of the valley.",
    "location": "Napa, United States",
    "price": 950,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1533496923483-70530737199c?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_napa_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Kitchen", "Hot Tub"],
    "propertyType": "Estate",
    "bedrooms": 5,
    "bathrooms": 5,
    "maxGuests": 10,
    "host": "hostId_9",
    "ratingsAverage": 5.0,
    "ratingsQuantity": 63,
    "isAvailable": true
  },
  {
    "title": "Industrial Loft in Downtown LA",
    "description": "A trendy industrial loft with high ceilings and large windows, located in the arts district of Los Angeles.",
    "location": "Los Angeles, United States",
    "price": 250,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_la_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Kitchen", "Gym", "Parking"],
    "propertyType": "Loft",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_10",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 118,
    "isAvailable": false
  },
  {
    "title": "Cozy Apartment in Old Montreal",
    "description": "Charming apartment with exposed brick walls and a vintage feel, located on a cobblestone street in historic Montreal.",
    "location": "Montreal, Canada",
    "price": 160,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1597153363841-356c9d09a0b1?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_montreal_1"
      }
    ],
    "amenities": ["WiFi", "Heating", "Kitchen", "TV"],
    "propertyType": "Apartment",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_11",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 205,
    "isAvailable": true
  },
  {
    "title": "Scottish Castle Gatehouse",
    "description": "Live a fairy tale in the gatehouse of a real Scottish castle. Explore the grounds and enjoy the historic atmosphere.",
    "location": "Highlands, Scotland",
    "price": 350,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1576727284683-9e4b1b45229d?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_scotland_1"
      }
    ],
    "amenities": ["Kitchen", "Fireplace", "Parking", "Heating"],
    "propertyType": "Castle",
    "bedrooms": 2,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_12",
    "ratingsAverage": 4.95,
    "ratingsQuantity": 91,
    "isAvailable": true
  },
  {
    "title": "Bright Studio in Rio near Ipanema",
    "description": "A modern and sunny studio apartment just two blocks from the famous Ipanema beach.",
    "location": "Rio de Janeiro, Brazil",
    "price": 130,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_rio_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Elevator", "Kitchenette"],
    "propertyType": "Studio",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_13",
    "ratingsAverage": 4.6,
    "ratingsQuantity": 188,
    "isAvailable": true
  },
  {
    "title": "Minimalist Loft in Copenhagen",
    "description": "Experience Danish design in this beautiful, minimalist loft located in the trendy Vesterbro neighborhood.",
    "location": "Copenhagen, Denmark",
    "price": 220,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&q=80&w=1974",
        "public_id": "listingimage_cph_1"
      }
    ],
    "amenities": ["WiFi", "Heating", "Kitchen", "Washer"],
    "propertyType": "Loft",
    "bedrooms": 2,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_14",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 103,
    "isAvailable": true
  },
  {
    "title": "Tranquil Garden Villa in Kyoto",
    "description": "Find your zen in this traditional Japanese house with a private garden, located near the famous Arashiyama Bamboo Grove.",
    "location": "Kyoto, Japan",
    "price": 380,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1528133418094-1f463320452d?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_kyoto_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Kitchen", "Garden"],
    "propertyType": "House",
    "bedrooms": 3,
    "bathrooms": 2,
    "maxGuests": 6,
    "host": "hostId_15",
    "ratingsAverage": 5.0,
    "ratingsQuantity": 121,
    "isAvailable": true
  },
  {
    "title": "Sky-High Condo in Chicago",
    "description": "Modern condo on the 50th floor with incredible views of Lake Michigan and the Chicago skyline.",
    "location": "Chicago, United States",
    "price": 280,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1596701062351-8c2c14d9fdd0?auto=format&fit=crop&q=80&w=1974",
        "public_id": "listingimage_chicago_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Gym", "City View"],
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "host": "hostId_16",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 92,
    "isAvailable": true
  },
  {
    "title": "Overwater Bungalow in the Maldives",
    "description": "The ultimate luxury experience. A private bungalow over crystal clear water with direct lagoon access.",
    "location": "Maldives",
    "price": 1500,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1515404929226-1483aef1a369?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_maldives_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Private Deck", "Breakfast Included"],
    "propertyType": "Bungalow",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_17",
    "ratingsAverage": 5.0,
    "ratingsQuantity": 130,
    "isAvailable": true
  },
  {
    "title": "Urban Jungle Apartment in Singapore",
    "description": "A unique apartment filled with plants, creating a green oasis in the middle of the bustling city of Singapore.",
    "location": "Singapore",
    "price": 210,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1525121045233-58d0339965a3?auto=format&fit=crop&q=80&w=1964",
        "public_id": "listingimage_singapore_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Kitchen", "Pool", "Gym"],
    "propertyType": "Apartment",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_18",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 85,
    "isAvailable": true
  },
  {
    "title": "Historic Home in Savannah",
    "description": "Stay in a beautiful, historic home with a classic Southern porch, located in the heart of Savannah's historic district.",
    "location": "Savannah, United States",
    "price": 260,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1621258673967-33d8a7c00f13?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_savannah_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Kitchen", "Parking"],
    "propertyType": "House",
    "bedrooms": 3,
    "bathrooms": 2,
    "maxGuests": 6,
    "host": "hostId_19",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 110,
    "isAvailable": true
  },
  {
    "title": "Icelandic Cabin with Northern Lights View",
    "description": "A remote and cozy cabin designed for optimal viewing of the Aurora Borealis. Features an outdoor hot tub.",
    "location": "Vik, Iceland",
    "price": 400,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1517173921526-9a2c3a516d2c?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_iceland_1"
      }
    ],
    "amenities": ["WiFi", "Heating", "Kitchenette", "Hot Tub"],
    "propertyType": "Cabin",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_20",
    "ratingsAverage": 4.95,
    "ratingsQuantity": 145,
    "isAvailable": true
  },
  {
    "title": "Ski-In/Ski-Out Chalet in Whistler",
    "description": "The ultimate convenience for skiers. This modern chalet offers direct access to the slopes of Whistler Blackcomb.",
    "location": "Whistler, Canada",
    "price": 750,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1549622958-c06437936162?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_whistler_1"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Fireplace", "Hot Tub", "Ski Storage"],
    "propertyType": "Chalet",
    "bedrooms": 4,
    "bathrooms": 4,
    "maxGuests": 10,
    "host": "hostId_1",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 78,
    "isAvailable": true
  },
  {
    "title": "Dublin City Centre Apartment",
    "description": "A comfortable apartment in the lively Temple Bar district. Perfect for exploring Dublin's pubs and history.",
    "location": "Dublin, Ireland",
    "price": 190,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1541513234213-6d11b3b3a6e6?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_dublin_1"
      }
    ],
    "amenities": ["WiFi", "Kitchen", "Heating", "Washer"],
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_2",
    "ratingsAverage": 4.6,
    "ratingsQuantity": 159,
    "isAvailable": true
  },
  {
    "title": "Rural Farm Stay in Provence",
    "description": "Experience the French countryside at this charming farm stay. Surrounded by lavender fields and olive groves.",
    "location": "Provence, France",
    "price": 230,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1508219345919-4581a03d3695?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_provence_1"
      }
    ],
    "amenities": ["WiFi", "Pool", "Kitchen", "Parking", "Pet Friendly"],
    "propertyType": "Farm Stay",
    "bedrooms": 3,
    "bathrooms": 2,
    "maxGuests": 6,
    "host": "hostId_3",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 101,
    "isAvailable": true
  },
  {
    "title": "Waterfront Condo in Vancouver",
    "description": "Enjoy stunning views of the water and mountains from this modern condo in Vancouver's Coal Harbour.",
    "location": "Vancouver, Canada",
    "price": 310,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1559511269-e3d42013b5c1?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_vancouver_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Gym", "Parking"],
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "host": "hostId_4",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 123,
    "isAvailable": true
  },
  {
    "title": "Budget-Friendly Hostel Room",
    "description": "A clean and friendly shared dorm room in a centrally located hostel. Great for backpackers and solo travelers.",
    "location": "Lisbon, Portugal",
    "price": 40,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1544120538-4a5f339f4d6d?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_lisbon_1"
      }
    ],
    "amenities": ["WiFi", "Shared Kitchen", "Lockers", "Common Area"],
    "propertyType": "Hostel",
    "bedrooms": 1,
    "bathrooms": 4,
    "maxGuests": 8,
    "host": "hostId_5",
    "ratingsAverage": 4.5,
    "ratingsQuantity": 450,
    "isAvailable": true
  },
  {
    "title": "Spacious Family Villa in an Olive Grove",
    "description": "A large, private villa perfect for family gatherings, set within a beautiful olive grove in Crete.",
    "location": "Crete, Greece",
    "price": 600,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1563723876332-e093551522a5?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_crete_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Kitchen", "Parking"],
    "propertyType": "Villa",
    "bedrooms": 5,
    "bathrooms": 5,
    "maxGuests": 10,
    "host": "hostId_6",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 55,
    "isAvailable": true
  },
  {
    "title": "Modernist House in Palm Springs",
    "description": "An iconic mid-century modern house with a stunning pool and classic desert landscaping.",
    "location": "Palm Springs, United States",
    "price": 550,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1582215882434-2a65d835150a?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_palmsprings_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Pool", "Hot Tub", "Parking"],
    "propertyType": "House",
    "bedrooms": 3,
    "bathrooms": 3,
    "maxGuests": 6,
    "host": "hostId_7",
    "ratingsAverage": 4.95,
    "ratingsQuantity": 82,
    "isAvailable": true
  },
  {
    "title": "Sea View Apartment in Mumbai",
    "description": "A contemporary apartment in Bandra with uninterrupted views of the Arabian Sea. Close to trendy cafes and shops.",
    "location": "Mumbai, India",
    "price": 150,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1567157577881-34ccb03f0b2a?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_mumbai_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Kitchen", "Gym", "Parking"],
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "host": "hostId_8",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 130,
    "isAvailable": true
  },
  {
    "title": "Off-Grid Tiny House in the Woods",
    "description": "A unique, self-sufficient tiny house for a true digital detox. Powered by solar and surrounded by nature.",
    "location": "Catskills, United States",
    "price": 180,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1526139334526-f59d5754b200?auto=format&fit=crop&q=80&w=2069",
        "public_id": "listingimage_tinyhouse_1"
      }
    ],
    "amenities": ["Kitchenette", "Indoor Fireplace", "Parking"],
    "propertyType": "Tiny House",
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "host": "hostId_9",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 201,
    "isAvailable": true
  },
  {
    "title": "Classic Brownstone in Brooklyn",
    "description": "Live like a local in this beautiful brownstone apartment in the charming neighborhood of Park Slope.",
    "location": "New York, United States",
    "price": 300,
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1596742578275-31d3d5268a86?auto=format&fit=crop&q=80&w=2070",
        "public_id": "listingimage_brooklyn_1"
      }
    ],
    "amenities": ["WiFi", "Air Conditioning", "Kitchen", "Washer", "Dryer"],
    "propertyType": "Apartment",
    "bedrooms": 2,
    "bathrooms": 1,
    "maxGuests": 4,
    "host": "hostId_10",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 149,
    "isAvailable": false
  }
];

export default sampleListings;
