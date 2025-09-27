import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaMapMarkerAlt, FaUsers, FaDollarSign, FaCamera, FaPlus, FaTimes, FaWifi, FaCar, FaSwimmingPool, FaTv, FaSnowflake, FaUtensils, FaPaw, FaFire, FaHotTub, FaDumbbell, FaGamepad, FaWind, FaWineGlass, FaChild, FaWheelchair, FaFirstAid, FaSmoking, FaUpload, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const BecomeHost = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to become a host');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    // Property Basics
    title: '',
    description: '',
    propertyType: '',
    roomType: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    coordinates: { lat: null, lng: null },
    
    // Capacity
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    
    // Amenities
    amenities: [],
    
    // Pricing
    basePrice: '',
    cleaningFee: '',
    serviceFee: '',
    weeklyDiscount: '',
    monthlyDiscount: '',
    
    // Photos
    images: [],
    
    // House Rules
    checkIn: '15:00',
    checkOut: '11:00',
    instantBook: false,
    smokingAllowed: false,
    petsAllowed: false,
    eventsAllowed: false,
    
    // Additional Details
    cancellationPolicy: 'moderate',
    minimumStay: 1,
    maximumStay: 365
  });

  const propertyTypes = [
    'House', 'Apartment', 'Condo', 'Villa', 'Cabin', 'Cottage', 
    'Loft', 'Townhouse', 'Guesthouse', 'Hotel', 'Bed & Breakfast', 'Other'
  ];

  const roomTypes = [
    'Entire place', 'Private room', 'Shared room', 'Hotel room'
  ];

  const availableAmenities = [
    { id: 'wifi', label: 'Wifi', icon: FaWifi },
    { id: 'parking', label: 'Free parking', icon: FaCar },
    { id: 'pool', label: 'Pool', icon: FaSwimmingPool },
    { id: 'tv', label: 'TV', icon: FaTv },
    { id: 'ac', label: 'Air conditioning', icon: FaSnowflake },
    { id: 'kitchen', label: 'Kitchen', icon: FaUtensils },
    { id: 'pets', label: 'Pets allowed', icon: FaPaw },
    { id: 'fireplace', label: 'Fireplace', icon: FaFire },
    { id: 'hotTub', label: 'Hot tub', icon: FaHotTub },
    { id: 'gym', label: 'Gym', icon: FaDumbbell },
    { id: 'gameArea', label: 'Game area', icon: FaGamepad },
    { id: 'balcony', label: 'Balcony', icon: FaWind },
    { id: 'bar', label: 'Bar', icon: FaWineGlass },
    { id: 'crib', label: 'Crib', icon: FaChild },
    { id: 'wheelchair', label: 'Wheelchair accessible', icon: FaWheelchair },
    { id: 'firstAid', label: 'First aid kit', icon: FaFirstAid },
    { id: 'smoking', label: 'Smoking allowed', icon: FaSmoking }
  ];

  const cancellationPolicies = [
    'flexible', 'moderate', 'strict'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result,
            uploaded: false
          };
          
          setUploadedImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = Array.from(event.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result,
            uploaded: false
          };
          
          setUploadedImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Token exists' : 'No token');
      console.log('User authenticated:', isAuthenticated);
      console.log('User object:', user);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      console.log('Upload response:', response.status, data);
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Upload failed');
      }
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to create a listing');
        navigate('/login');
        return;
      }

      // Upload images to Cloudinary through our backend
      const imageUrls = [];
      if (uploadedImages.length > 0) {
        toast.loading('Uploading images...', { id: 'image-upload' });
        
        for (const image of uploadedImages) {
          if (image.file) {
            try {
              const url = await uploadToCloudinary(image.file);
              imageUrls.push(url);
            } catch (error) {
              toast.error(`Failed to upload image: ${image.file.name}`);
              console.error('Image upload error:', error);
            }
          }
        }
        
        toast.dismiss('image-upload');
        if (imageUrls.length === 0) {
          toast.error('Failed to upload images. Please try again.');
          return;
        }
        toast.success(`Uploaded ${imageUrls.length} image(s)`);
      }
      
      // Prepare final form data
      const listingData = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        roomType: formData.roomType,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
        maxGuests: formData.maxGuests,
        bedrooms: formData.bedrooms,
        beds: formData.beds,
        bathrooms: formData.bathrooms,
        amenities: formData.amenities,
        basePrice: formData.basePrice,
        cleaningFee: formData.cleaningFee,
        serviceFee: formData.serviceFee,
        weeklyDiscount: formData.weeklyDiscount,
        monthlyDiscount: formData.monthlyDiscount,
        images: imageUrls,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        instantBook: formData.instantBook,
        smokingAllowed: formData.smokingAllowed,
        petsAllowed: formData.petsAllowed,
        eventsAllowed: formData.eventsAllowed,
        cancellationPolicy: formData.cancellationPolicy,
        minimumStay: formData.minimumStay,
        maximumStay: formData.maximumStay,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      // Only add coordinates if they have valid values
      if (formData.coordinates && 
          typeof formData.coordinates.lat === 'number' && 
          typeof formData.coordinates.lng === 'number' &&
          !isNaN(formData.coordinates.lat) && 
          !isNaN(formData.coordinates.lng) &&
          formData.coordinates.lat !== null && 
          formData.coordinates.lng !== null) {
        listingData.coordinates = formData.coordinates;
      }
      
      // Submit to backend
      toast.loading('Creating listing...', { id: 'create-listing' });
      
      const response = await fetch('/api/listings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(listingData)
      });
      
      const result = await response.json();
      toast.dismiss('create-listing');
      
      if (response.ok) {
        toast.success('🎉 Listing created successfully!');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          propertyType: '',
          roomType: '',
          address: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
          coordinates: { lat: null, lng: null },
          maxGuests: 1,
          bedrooms: 1,
          beds: 1,
          bathrooms: 1,
          amenities: [],
          basePrice: '',
          cleaningFee: '',
          serviceFee: '',
          weeklyDiscount: '',
          monthlyDiscount: '',
          images: [],
          checkIn: '15:00',
          checkOut: '11:00',
          instantBook: false,
          smokingAllowed: false,
          petsAllowed: false,
          eventsAllowed: false,
          cancellationPolicy: 'moderate',
          minimumStay: 1,
          maximumStay: 365
        });
        setUploadedImages([]);
        setCurrentStep(1);
        
        // Redirect to home or listings page after a delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
      } else {
        throw new Error(result.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.dismiss('create-listing');
      toast.dismiss('image-upload');
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        toast.error('Please login to create a listing');
        navigate('/login');
      } else {
        toast.error(`Error creating listing: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaHome className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your place</h2>
              <p className="text-gray-600">Share some basic info, like where it is and how many guests can stay.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Give your listing a catchy title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type.toLowerCase()}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => handleInputChange('roomType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select room type</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type.toLowerCase().replace(' ', '_')}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Guests</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('maxGuests', Math.max(1, formData.maxGuests - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{formData.maxGuests}</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('maxGuests', Math.min(16, formData.maxGuests + 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your place to guests..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('bedrooms', Math.max(1, formData.bedrooms - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{formData.bedrooms}</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('bedrooms', Math.min(10, formData.bedrooms + 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beds</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('beds', Math.max(1, formData.beds - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{formData.beds}</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('beds', Math.min(16, formData.beds + 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('bathrooms', Math.max(1, formData.bathrooms - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{formData.bathrooms}</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('bathrooms', Math.min(10, formData.bathrooms + 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaMapMarkerAlt className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Where's your place located?</h2>
              <p className="text-gray-600">Your address is only shared with guests after they make a reservation.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New York"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="NY"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="United States"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="10001"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaWifi className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What amenities do you offer?</h2>
              <p className="text-gray-600">Let guests know what your place has to offer.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableAmenities.map(amenity => {
                const IconComponent = amenity.icon;
                const isSelected = formData.amenities.includes(amenity.id);
                
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{amenity.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaCamera className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Add some photos of your place</h2>
              <p className="text-gray-600">Photos help guests imagine staying in your place.</p>
            </div>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Drag and drop your images here</p>
              <p className="text-gray-600 mb-4">or</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Browse Files
              </button>
            </div>
            
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map(image => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt="Upload preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaDollarSign className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Set your price</h2>
              <p className="text-gray-600">You can change your pricing anytime.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Price per Night ($)</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => handleInputChange('basePrice', e.target.value)}
                  placeholder="100"
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cleaning Fee ($)</label>
                <input
                  type="number"
                  value={formData.cleaningFee}
                  onChange={(e) => handleInputChange('cleaningFee', e.target.value)}
                  placeholder="25"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Discount (%)</label>
                <input
                  type="number"
                  value={formData.weeklyDiscount}
                  onChange={(e) => handleInputChange('weeklyDiscount', e.target.value)}
                  placeholder="10"
                  min="0"
                  max="99"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Discount (%)</label>
                <input
                  type="number"
                  value={formData.monthlyDiscount}
                  onChange={(e) => handleInputChange('monthlyDiscount', e.target.value)}
                  placeholder="20"
                  min="0"
                  max="99"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
                <input
                  type="time"
                  value={formData.checkIn}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
                <input
                  type="time"
                  value={formData.checkOut}
                  onChange={(e) => handleInputChange('checkOut', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stay (nights)</label>
                <input
                  type="number"
                  value={formData.minimumStay}
                  onChange={(e) => handleInputChange('minimumStay', e.target.value)}
                  placeholder="1"
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
              <select
                value={formData.cancellationPolicy}
                onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {cancellationPolicies.map(policy => (
                  <option key={policy} value={policy}>
                    {policy.charAt(0).toUpperCase() + policy.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepComplete = (step) => {
    switch(step) {
      case 1:
        return formData.title && formData.description && formData.propertyType && formData.roomType;
      case 2:
        return formData.address && formData.city && formData.state && formData.country && formData.zipCode;
      case 3:
        return true; // Amenities are optional
      case 4:
        return uploadedImages.length > 0;
      case 5:
        return formData.basePrice && parseFloat(formData.basePrice) > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Show loading while checking authentication */}
      {!isAuthenticated ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaSpinner className="animate-spin w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4, 5].map(step => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step < currentStep
                      ? 'bg-red-500 text-white'
                      : step === currentStep
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepComplete(currentStep)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepComplete(currentStep) || loading}
                  className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading && <FaSpinner className="animate-spin" />}
                  <span>{loading ? 'Creating Listing...' : 'Create Listing'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BecomeHost;