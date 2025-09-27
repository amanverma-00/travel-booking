import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaStar, FaWifi, FaCar, FaSwimmingPool, FaDumbbell, FaConciergeBell, FaSnowflake, FaMapMarkerAlt, FaBed, FaBath, FaUsers, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { translateContent, needsTranslation } from '../utils/contentTranslator';
import toast from 'react-hot-toast';
import { getMockListings } from '../utils/categoryUtils';
import { fetchListingByIdFromAPI } from '../utils/apiUtils';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Calendar from '../components/Calendar';
import ListingMap from '../components/ListingMap';
import PropertyBookingCard from '../components/PropertyBookingCard';

const ListingDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const wishlistItems = useSelector(state => state.wishlist.items);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    name: ''
  });
  const [bookingData, setBookingData] = useState({
    checkIn: null,
    checkOut: null,
    adults: 1,
    children: 0
  });
  const amenityIcons = {
    'WiFi': FaWifi,
    'Air Conditioning': FaSnowflake,
    'Pool': FaSwimmingPool,
    'Parking': FaCar,
    'Gym': FaDumbbell,
    'Room Service': FaConciergeBell,
    'Concierge': FaConciergeBell
  };

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        try {
          console.log('Fetching listing from API:', id);
          const apiListing = await fetchListingByIdFromAPI(id);
          console.log('Listing fetched from API:', apiListing);
          setListing(apiListing);
          await fetchReviews(id);
        } catch (apiError) {
          console.warn('API failed, trying mock data:', apiError.message);
          const mockListings = getMockListings();
          const foundListing = mockListings.find(l => l._id === id);
          
          if (foundListing) {
            console.log('Using mock listing:', foundListing);
            setListing(foundListing);
            await fetchReviews(id);
          } else {
            console.error('Listing not found:', id);
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    const fetchReviews = async (listingId) => {
      try {
        console.log('Fetching reviews for listing:', listingId);
        const response = await fetch(`/api/reviews/listing/${listingId}`);
        console.log('Review fetch response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Review data received:', data);
          
          if (data.success) {
            const formattedReviews = data.data.map(review => ({
              id: review._id,
              name: review.user?.firstName || 'Anonymous',
              rating: review.rating,
              comment: review.comment,
              date: new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              isVerified: review.isVerified
            }));
            console.log('Formatted reviews:', formattedReviews);
            setReviews(formattedReviews);
          }
        } else {
          console.log('Review fetch failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!newReview.comment.trim()) {
      toast.error(t('listing.writeComment'));
      return;
    }

    if (isAuthenticated) {
      if (typeof id === 'string' && !id.match(/^[0-9a-fA-F]{24}$/)) {
        toast('Reviews are not available for sample listings. This feature works with database listings.', {
          icon: 'ℹ️',
        });
        return;
      }

      try {
        console.log('Submitting review for listing:', id);
        console.log('Review data:', { listingId: id, rating: newReview.rating, comment: newReview.comment });
        
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            listingId: id,
            rating: newReview.rating,
            comment: newReview.comment,
          }),
        });

        console.log('Review submission response status:', response.status);
        const data = await response.json();
        console.log('Review submission response:', data);

        if (data.success) {
          await fetchReviews(id);
          setNewReview({ rating: 5, comment: '', name: '' });
          toast.success('Review submitted successfully!');
        } else {
          toast.error(data.error || 'Failed to submit review. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        toast.error('Failed to submit review. Please check your connection.');
      }
    } else {
      toast('Please login to submit a review.', {
        icon: 'ℹ️',
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (listing.images?.length - 1) ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (listing.images?.length - 1) : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('listing.listingNotFound')}</h1>
          <button
            onClick={() => navigate('/')}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            {t('listing.backToHome')}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const placeholderImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
  ];

  const imagesToShow = listing.images?.length > 0 
    ? listing.images 
    : placeholderImages;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          {t('listing.backToListings')}
        </button>

        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="aspect-[16/9] lg:aspect-[16/8] overflow-hidden rounded-xl bg-gray-200">
            <img
              src={imagesToShow[currentImageIndex] || placeholderImages[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {imagesToShow.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
                >
                  <FaArrowLeft className="rotate-180" />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {imagesToShow.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Rating */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {translateContent(listing.title, t, 'title')}
                </h1>
                <button
                  onClick={() => {
                    const isInWishlist = wishlistItems.some(item => item._id === listing._id);
                    if (isInWishlist) {
                      dispatch(removeFromWishlist(listing._id));
                      toast.success('Removed from wishlist!');
                    } else {
                      dispatch(addToWishlist(listing));
                      toast.success('Added to wishlist!');
                    }
                  }}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {wishlistItems.some(item => item._id === listing._id) ? (
                    <FaHeart className="text-pink-600 text-xl" />
                  ) : (
                    <FaRegHeart className="text-gray-600 text-xl hover:text-pink-600" />
                  )}
                </button>
              </div>
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="ml-1 font-medium">{listing.ratingsAverage}</span>
                  <span className="ml-1 text-gray-600">({listing.ratingsQuantity} reviews)</span>
                </div>
                <span className="mx-2 text-gray-400">•</span>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="text-sm mr-1" />
                  {listing.location ? `${listing.location.city}, ${listing.location.state}, ${listing.location.country}` : 'Location not available'}
                </div>
              </div>
              <div className="flex items-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <FaBed className="mr-1" />
                  {listing.capacity?.bedrooms || 0} bedrooms
                </div>
                <div className="flex items-center">
                  <FaBath className="mr-1" />
                  {listing.capacity?.bathrooms || 0} bathrooms
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-1" />
                  Up to {listing.capacity?.maxGuests || 0} guests
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t('content.aboutThisPlace', { defaultValue: 'About this place' })}</h2>
              <p className="text-gray-700 leading-relaxed">
                {translateContent(listing.description, t, 'description')}
              </p>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('listing.amenities')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity] || FaConciergeBell;
                    return (
                      <div key={index} className="flex items-center text-gray-700">
                        <IconComponent className="mr-2 text-pink-600" />
                        {t(`amenities.${amenity}`, { defaultValue: amenity })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location Map */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                <FaMapMarkerAlt className="inline mr-2 text-pink-600" />
                {t('listing.location')}
              </h2>
              <ListingMap listing={listing} />
              <p className="text-sm text-gray-600 mt-2">
                {listing.location?.address}, {listing.location?.city}, {listing.location?.state}, {listing.location?.country}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">
                <FaStar className="inline text-yellow-400 mr-2" />
                {listing.ratingsAverage} • {reviews.length} {t('listing.reviews')}
              </h2>
              
              {/* Reviews List */}
              <div className="space-y-6 mb-8">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-gray-700">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{review.name}</p>
                            {review.isVerified && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {t('listing.verified')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`text-sm ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FaStar className="text-gray-400 text-3xl mx-auto mb-2" />
                    <p className="text-gray-600">
                      {typeof id === 'string' && !id.match(/^[0-9a-fA-F]{24}$/) ? 
                        t('listing.sampleListingReviews') :
                        t('listing.noReviews')
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="bg-gray-50 rounded-lg p-6">
                {isAuthenticated ? (
                  <>
                    <h3 className="text-lg font-semibold mb-4">{t('listing.addReview')}</h3>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('listing.rating')}
                        </label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => setNewReview({...newReview, rating})}
                              className={`text-2xl ${
                                rating <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                              } hover:text-yellow-400 transition-colors`}
                            >
                              <FaStar />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('listing.yourReview')}
                        </label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder={t('listing.reviewPlaceholder')}
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                      >
                        {t('listing.submitReview')}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">{t('listing.wantToReview')}</h3>
                    <p className="text-gray-600 mb-4">{t('listing.loginToReview')}</p>
                    <Link
                      to="/login"
                      className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      {t('listing.loginButton')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <PropertyBookingCard listing={listing} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetail;