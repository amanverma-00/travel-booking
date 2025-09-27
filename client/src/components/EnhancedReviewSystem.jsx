import React, { useState, useEffect } from 'react';
import { 
  StarIcon, 
  HandThumbUpIcon, 
  HandThumbDownIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const EnhancedReviewSystem = ({ bookingId, userType = 'guest' }) => {
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Review form state
  const [reviewData, setReviewData] = useState({
    overallRating: 0,
    cleanliness: 0,
    accuracy: 0,
    communication: 0,
    location: 0,
    checkIn: 0,
    value: 0,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
    fetchMyReview();
  }, [bookingId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/enhanced-reviews/${bookingId}/reviews`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReview = async () => {
    try {
      const response = await fetch(`/api/enhanced-reviews/${bookingId}/my-review`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setMyReview(data.review);
      }
    } catch (error) {
      console.error('Error fetching my review:', error);
    }
  };

  const submitReview = async () => {
    try {
      const response = await fetch(`/api/enhanced-reviews/${bookingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...reviewData,
          reviewType: userType === 'guest' ? 'guest-to-host' : 'host-to-guest'
        })
      });
      
      if (response.ok) {
        setShowReviewForm(false);
        fetchReviews();
        fetchMyReview();
        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  const voteHelpful = async (reviewId, isHelpful) => {
    try {
      const response = await fetch(`/api/enhanced-reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ isHelpful })
      });
      
      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const StarRating = ({ rating, onRatingChange, category }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange && onRatingChange(category, star)}
            className={`${onRatingChange ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
          >
            {star <= rating ? (
              <StarSolidIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const getAverageRating = (review) => {
    const ratings = [
      review.ratings.cleanliness,
      review.ratings.accuracy,
      review.ratings.communication,
      review.ratings.location,
      review.ratings.checkIn,
      review.ratings.value
    ];
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const handleRatingChange = (category, rating) => {
    setReviewData(prev => ({
      ...prev,
      [category]: rating,
      overallRating: category === 'overallRating' ? rating : prev.overallRating
    }));
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
        
        {!myReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write Review
          </button>
        )}
      </div>

      {/* My Review */}
      {myReview && (
        <div className="mb-6 p-4 border-2 border-blue-100 rounded-lg bg-blue-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Your Review</h3>
            <StarRating rating={getAverageRating(myReview)} />
          </div>
          <p className="text-gray-700">{myReview.comment}</p>
          <p className="text-xs text-gray-500 mt-2">
            Posted {new Date(myReview.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* All Reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reviews yet</p>
            <p className="text-sm text-gray-500">Be the first to leave a review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {review.reviewer.profilePicture ? (
                    <img 
                      src={review.reviewer.profilePicture} 
                      alt={review.reviewer.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{review.reviewer.name}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StarRating rating={getAverageRating(review)} />
                  </div>
                  
                  {/* Category Ratings */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cleanliness:</span>
                      <StarRating rating={review.ratings.cleanliness} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accuracy:</span>
                      <StarRating rating={review.ratings.accuracy} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Communication:</span>
                      <StarRating rating={review.ratings.communication} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <StarRating rating={review.ratings.location} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <StarRating rating={review.ratings.checkIn} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <StarRating rating={review.ratings.value} />
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  
                  {/* Host Response */}
                  {review.response && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <h5 className="font-medium text-gray-900 mb-1">Host Response:</h5>
                      <p className="text-gray-700 text-sm">{review.response.message}</p>
                    </div>
                  )}
                  
                  {/* Helpful Votes */}
                  <div className="flex items-center space-x-4 text-sm">
                    <button
                      onClick={() => voteHelpful(review._id, true)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
                    >
                      <HandThumbUpIcon className="h-4 w-4" />
                      <span>Helpful ({review.helpfulVotes?.positive || 0})</span>
                    </button>
                    <button
                      onClick={() => voteHelpful(review._id, false)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
                    >
                      <HandThumbDownIcon className="h-4 w-4" />
                      <span>Not Helpful ({review.helpfulVotes?.negative || 0})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Write a Review
            </h3>
            
            {/* Overall Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <StarRating 
                rating={reviewData.overallRating} 
                onRatingChange={handleRatingChange}
                category="overallRating"
              />
            </div>
            
            {/* Category Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { key: 'cleanliness', label: 'Cleanliness' },
                { key: 'accuracy', label: 'Accuracy' },
                { key: 'communication', label: 'Communication' },
                { key: 'location', label: 'Location' },
                { key: 'checkIn', label: 'Check-in' },
                { key: 'value', label: 'Value' }
              ].map((category) => (
                <div key={category.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {category.label}
                  </label>
                  <StarRating 
                    rating={reviewData[category.key]} 
                    onRatingChange={handleRatingChange}
                    category={category.key}
                  />
                </div>
              ))}
            </div>
            
            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReviewForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={reviewData.overallRating === 0}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedReviewSystem;