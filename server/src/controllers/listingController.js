import Listing from "../models/listing.js";
import Review from "../models/review.js";
import User from "../models/user.js";

export const createListing = async (req, res) => {
  try {
    console.log('Creating listing with data:', JSON.stringify(req.body, null, 2));
    
    const {
      title,
      description,
      propertyType,
      roomType,
      address,
      city,
      state,
      country,
      zipCode,
      coordinates,
      maxGuests,
      bedrooms,
      beds,
      bathrooms,
      amenities,
      basePrice,
      cleaningFee,
      serviceFee,
      weeklyDiscount,
      monthlyDiscount,
      images,
      checkIn,
      checkOut,
      instantBook,
      smokingAllowed,
      petsAllowed,
      eventsAllowed,
      cancellationPolicy,
      minimumStay,
      maximumStay
    } = req.body;

    // Create listing with comprehensive data structure
    // Only include coordinates if they have valid values
    const locationData = {
      address,
      city,
      state,
      country,
      zipCode
    };

    // Add coordinates only if they are valid numbers
    if (coordinates && 
        typeof coordinates.lat === 'number' && 
        typeof coordinates.lng === 'number' &&
        !isNaN(coordinates.lat) && 
        !isNaN(coordinates.lng)) {
      locationData.coordinates = coordinates;
    }

    const listing = await Listing.create({
      title,
      description,
      propertyType,
      roomType,
      location: locationData,
      capacity: {
        maxGuests: parseInt(maxGuests) || 1,
        bedrooms: parseInt(bedrooms) || 1,
        beds: parseInt(beds) || 1,
        bathrooms: parseInt(bathrooms) || 1
      },
      amenities: amenities || [],
      pricing: {
        basePrice: parseFloat(basePrice) || 0,
        cleaningFee: parseFloat(cleaningFee) || 0,
        serviceFee: parseFloat(serviceFee) || 0,
        weeklyDiscount: parseInt(weeklyDiscount) || 0,
        monthlyDiscount: parseInt(monthlyDiscount) || 0
      },
      images: images || [],
      houseRules: {
        checkIn: checkIn || '15:00',
        checkOut: checkOut || '11:00',
        instantBook: instantBook || false,
        smokingAllowed: smokingAllowed || false,
        petsAllowed: petsAllowed || false,
        eventsAllowed: eventsAllowed || false
      },
      policies: {
        cancellation: cancellationPolicy || 'moderate',
        minimumStay: parseInt(minimumStay) || 1,
        maximumStay: parseInt(maximumStay) || 365
      },
      host: req.user._id,
      isActive: true,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Listing created successfully:', listing._id);

    // Update user role to 'host' if they created their first listing
    const user = await User.findById(req.user._id);
    if (user && user.role !== 'admin' && user.role !== 'host') {
      await User.findByIdAndUpdate(req.user._id, { role: 'host' });
      console.log(`Updated user ${user.firstName} ${user.lastName} role to host`);
    }

    // Populate host info for response
    const populatedListing = await Listing.findById(listing._id).populate('host', 'firstName lastName email profileImage');

    console.log('Sending response with populated listing:', populatedListing.title);

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: populatedListing
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getListings = async (req, res) => {
  try {
    console.log('=== GET LISTINGS API CALLED ===');
    console.log('Query parameters:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build comprehensive filter object
    const filter = { 
      isActive: true, 
      isAvailable: true 
    };
    
    // Location-based filtering (supports city, state, country, address)
    if (req.query.location) {
      filter.$or = [
        { 'location.city': new RegExp(req.query.location, 'i') },
        { 'location.state': new RegExp(req.query.location, 'i') },
        { 'location.country': new RegExp(req.query.location, 'i') },
        { 'location.address': new RegExp(req.query.location, 'i') },
        { title: new RegExp(req.query.location, 'i') },
        { description: new RegExp(req.query.location, 'i') }
      ];
    }
    
    // Property type filtering
    if (req.query.propertyType) {
      filter.propertyType = new RegExp(`^${req.query.propertyType}$`, 'i');
    }
    
    // Specific city filtering
    if (req.query.city) {
      filter['location.city'] = new RegExp(`^${req.query.city}$`, 'i');
    }
    
    // Price range filtering
    if (req.query.maxPrice || req.query.minPrice) {
      filter.$and = filter.$and || [];
      
      if (req.query.maxPrice) {
        filter.$and.push({
          $or: [
            { 'pricing.basePrice': { $lte: parseFloat(req.query.maxPrice) } },
            { price: { $lte: parseFloat(req.query.maxPrice) } }
          ]
        });
      }
      
      if (req.query.minPrice) {
        filter.$and.push({
          $or: [
            { 'pricing.basePrice': { $gte: parseFloat(req.query.minPrice) } },
            { price: { $gte: parseFloat(req.query.minPrice) } }
          ]
        });
      }
    }
    
    // Guest capacity filtering
    if (req.query.minGuests) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { 'capacity.maxGuests': { $gte: parseInt(req.query.minGuests) } },
          { maxGuests: { $gte: parseInt(req.query.minGuests) } }
        ]
      });
    }

    console.log('Using filter:', JSON.stringify(filter, null, 2));

    // Execute the query with population
    const listings = await Listing.find(filter)
      .populate('host', 'firstName lastName profileImage')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    console.log(`Found ${listings.length} listings total`);
    
    if (listings.length > 0) {
      listings.forEach((listing, index) => {
        console.log(`Listing ${index + 1}: ${listing.title} (${listing.propertyType}) - Active: ${listing.isActive}, Available: ${listing.isAvailable}`);
      });
    }

    const total = await Listing.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('host', 'firstName profileImage');

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Get reviews for this listing
    const reviews = await Review.find({ listing: listing._id })
      .populate('user', 'firstName profileImage');

    res.status(200).json({
      success: true,
      data: {
        ...listing.toObject(),
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateListing = async (req, res) => {
  try {
    console.log('=== UPDATE LISTING REQUEST ===');
    console.log('Listing ID:', req.params.id);
    console.log('User ID:', req.user ? req.user._id : 'No user');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      console.log('ERROR: Listing not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    console.log('Found listing:', listing._id, 'hosted by:', listing.host);

    // Check if user is the host
    if (listing.host.toString() !== req.user._id.toString()) {
      console.log('ERROR: Authorization failed - listing host:', listing.host.toString(), 'user:', req.user._id.toString());
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this listing'
      });
    }

    console.log('Authorization successful - updating listing...');

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    console.log('Listing updated successfully');
    
    res.status(200).json({
      success: true,
      data: updatedListing
    });
  } catch (error) {
    console.log('=== UPDATE LISTING ERROR ===');
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('Error name:', error.name);
    console.log('Validation errors:', error.errors);
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    // Check if user is the host
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this listing'
      });
    }

    await listing.remove();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all listings
export const getAllListings = async (req, res) => {
  try {
    console.log('=== GET ALL LISTINGS REQUEST ===');
    console.log('Query params:', req.query);
    console.log('Request URL:', req.url);
    
    const { page = 1, limit = 20, propertyType, minPrice, maxPrice, location } = req.query;
    
    console.log('Parsed params:', { page, limit, propertyType, minPrice, maxPrice, location });
    
    // Build filter object
    const filter = { isAvailable: true };
    
    if (propertyType) {
      filter.propertyType = propertyType;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    console.log('Filter object:', JSON.stringify(filter, null, 2));

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    console.log('Pagination:', { page, limit, skip });

    // Fetch listings with pagination and populate host info
    console.log('Executing database query...');
    const listings = await Listing.find(filter)
      .populate('host', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    console.log(`Found ${listings.length} listings`);

    // Get total count for pagination
    const totalListings = await Listing.countDocuments(filter);
    const totalPages = Math.ceil(totalListings / limit);

    console.log(`Total listings: ${totalListings}, Total pages: ${totalPages}`);

    const response = {
      success: true,
      data: listings,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalListings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    };

    console.log('=== SENDING RESPONSE ===');
    console.log('Response status: 200');
    console.log('Response data count:', listings.length);
    
    res.status(200).json(response);
  } catch (error) {
    console.error('=== GET ALL LISTINGS ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};