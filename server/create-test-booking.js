import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wanderlust', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['guest', 'host', 'admin'], default: 'guest' }
});

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const bookingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'confirmed', 'active', 'completed', 'cancelled_by_guest', 'cancelled_by_host'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  cancellationReason: String,
  guestNotes: String,
  hostNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Listing = mongoose.model('Listing', listingSchema);
const Booking = mongoose.model('Booking', bookingSchema);

async function createTestBooking() {
  try {
    console.log('Creating test user and booking...');
    
    // Create or find a test user
    let testUser = await User.findOne({ email: 'testuser@example.com' });
    if (!testUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      testUser = await User.create({
        username: 'testuser',
        email: 'testuser@example.com',
        password: hashedPassword,
        role: 'guest'
      });
      console.log('Created test user:', testUser._id);
    } else {
      console.log('Found existing test user:', testUser._id);
    }
    
    // Find a listing to book
    const listing = await Listing.findOne().populate('owner');
    if (!listing) {
      console.log('No listings found in database');
      return;
    }
    
    console.log('Found listing:', listing.title);
    console.log('Owner:', listing.owner);
    
    // If owner is null, find any user to be the host
    let hostUser = listing.owner;
    if (!hostUser) {
      hostUser = await User.findOne({ role: { $ne: 'guest' } }); // Find a host or admin
      if (!hostUser) {
        // Create a host user if none exists
        const hashedPassword = await bcrypt.hash('hostpass123', 10);
        hostUser = await User.create({
          username: 'testhost',
          email: 'testhost@example.com',
          password: hashedPassword,
          role: 'host'
        });
        console.log('Created host user:', hostUser._id);
        
        // Update the listing to have this host as owner
        await Listing.findByIdAndUpdate(listing._id, { owner: hostUser._id });
      }
    }
    
    // Create test bookings with different statuses
    const bookingData = [
      {
        listing: listing._id,
        guest: testUser._id,
        host: hostUser._id,
        checkInDate: new Date('2024-02-01'),
        checkOutDate: new Date('2024-02-05'),
        guests: 2,
        totalPrice: 5000,
        status: 'pending',
        paymentStatus: 'pending',
        guestNotes: 'Looking forward to our stay!'
      },
      {
        listing: listing._id,
        guest: testUser._id,
        host: hostUser._id,
        checkInDate: new Date('2024-01-15'),
        checkOutDate: new Date('2024-01-20'),
        guests: 3,
        totalPrice: 7500,
        status: 'approved',
        paymentStatus: 'completed',
        guestNotes: 'Approved booking for family trip'
      },
      {
        listing: listing._id,
        guest: testUser._id,
        host: hostUser._id,
        checkInDate: new Date('2023-12-10'),
        checkOutDate: new Date('2023-12-15'),
        guests: 1,
        totalPrice: 3000,
        status: 'completed',
        paymentStatus: 'completed',
        guestNotes: 'Had a wonderful stay!'
      }
    ];
    
    for (let data of bookingData) {
      // Check if booking already exists
      const existingBooking = await Booking.findOne({
        guest: data.guest,
        listing: data.listing,
        checkInDate: data.checkInDate
      });
      
      if (!existingBooking) {
        const booking = await Booking.create(data);
        console.log(`Created ${data.status} booking:`, booking._id);
      } else {
        console.log(`Booking already exists for ${data.checkInDate}`);
      }
    }
    
    console.log('Test bookings created successfully!');
    
  } catch (error) {
    console.error('Error creating test booking:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestBooking();