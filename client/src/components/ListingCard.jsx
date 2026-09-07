import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';

import { getImageUrl, handleImageError } from '../utils/imageUtils';

const ListingCard = ({ listing }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Check if current listing is in wishlist
  const isFavorite = wishlistItems.some(item => item._id === listing._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      dispatch(removeFromWishlist(listing._id));
      toast.success('Removed from wishlist', {
        icon: '💔',
        duration: 2000,
      });
    } else {
      dispatch(addToWishlist(listing));
      toast.success('Added to wishlist!', {
        icon: '❤️',
        duration: 2000,
      });
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === (listing.images?.length - 1) ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? (listing.images?.length - 1) : prev - 1
    );
  };

  const placeholderImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400'
  ];

  const imagesToShow = listing.images?.length > 0 
    ? listing.images 
    : placeholderImages;

  return (
    <Link 
      to={`/listing/${listing._id}`}
      className="group block"
    >
      <div className="relative">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200">
          <img
            src={getImageUrl(imagesToShow[currentImageIndex], placeholderImages[0])}
            alt={listing.title}
            onError={(e) => handleImageError(e, placeholderImages[0])}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Image Navigation */}
          {imagesToShow.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Dots Indicator */}
          {imagesToShow.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
              {imagesToShow.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform"
          >
            {isFavorite ? (
              <FaHeart className="w-5 h-5 text-[#ff385c]" />
            ) : (
              <FaRegHeart className="w-5 h-5 text-white drop-shadow-sm" />
            )}
          </button>
        </div>

        {/* Listing Info */}
        <div className="mt-3">
          {/* Location and Rating */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 truncate">
              {listing.location ? `${listing.location.city}, ${listing.location.state}` : 'Location not available'}
            </h3>
            {listing.ratingsAverage > 0 && (
              <div className="flex items-center space-x-1">
                <FaStar className="w-3 h-3 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {listing.ratingsAverage.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Property Type */}
          <p className="text-sm text-gray-500 mt-1">
            {listing.propertyType}
          </p>

          {/* Title */}
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {listing.title}
          </p>

          {/* Price */}
          <div className="mt-2">
            <span className="font-semibold text-gray-900">
              ₹{listing.pricing?.basePrice?.toLocaleString() || 'N/A'}
            </span>
            <span className="text-gray-500 text-sm"> night</span>
          </div>

          {/* Additional Info */}
          <div className="flex items-center text-xs text-gray-500 mt-2 space-x-3">
            <span>{listing.capacity?.bedrooms || 0} bedroom{(listing.capacity?.bedrooms || 0) !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{listing.capacity?.maxGuests || 0} guest{(listing.capacity?.maxGuests || 0) !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;