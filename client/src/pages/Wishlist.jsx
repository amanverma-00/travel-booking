import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';

const Wishlist = () => {
  const wishlistItems = useSelector(state => state.wishlist.items);
  const { user } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center mb-2">
            <FaHeart className="text-pink-600 text-2xl mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          
          <p className="text-gray-600">
            {wishlistItems.length > 0 
              ? `${wishlistItems.length} saved ${wishlistItems.length === 1 ? 'property' : 'properties'}`
              : 'No properties saved yet'
            }
          </p>
        </div>

        {/* Wishlist Content */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {wishlistItems.map((listing) => (
              <ListingCard 
                key={listing._id} 
                listing={listing} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <FaHeart className="text-6xl text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start exploring and save your favorite places to stay
              </p>
              <Link
                to="/"
                className="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
              >
                Start Exploring
              </Link>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {wishlistItems.length > 0 && (
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Your Wishlist Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600 mb-2">
                  {wishlistItems.length}
                </div>
                <div className="text-sm text-gray-600">
                  Total Properties
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {new Set(wishlistItems.map(item => item.propertyType)).size}
                </div>
                <div className="text-sm text-gray-600">
                  Property Types
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  ₹{Math.min(...wishlistItems.map(item => item.price)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Lowest Price
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;