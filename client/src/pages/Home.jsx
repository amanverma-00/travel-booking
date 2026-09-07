import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import CategorySection from '../components/CategorySection';
import ListingsGrid from '../components/ListingsGrid';
import BookingCard from '../components/BookingCard';
import Footer from '../components/Footer';
import { fetchAllListings, getFeaturedListings } from '../utils/categoryUtils';
import { getFeaturedListingsFromAPI } from '../utils/apiUtils';

const Home = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryView, setShowCategoryView] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (categoryType) => {
    setActiveFilter(categoryType);
    setShowCategoryView(false);
    setSelectedCategory(categoryType);
  };

  const handleBackToCategories = () => {
    setShowCategoryView(true);
    setActiveFilter('all');
    setSelectedCategory(null);
  };

  useEffect(() => {
    const loadFeaturedListings = async () => {
      setLoading(true);
      try {
        // Try to load from API first, fallback to mock data
        try {
          console.log('Loading listings from API...');
          const featured = await getFeaturedListingsFromAPI(5);
          console.log('Featured categories from API:', featured);
          if (Array.isArray(featured) && featured.length > 0) {
            featured.forEach(category => {
              console.log(`${category.name}: ${category.listings ? category.listings.length : 0} listings`);
            });
            setFeaturedCategories(featured);
          } else {
            throw new Error('No featured categories returned from API');
          }
        } catch (apiError) {
          console.warn('API failed, falling back to mock data:', apiError.message);
          // Fallback to mock data
          const allListings = await fetchAllListings();
          console.log('Total listings loaded from mock:', allListings.length);
          const featured = getFeaturedListings(allListings, 5);
          console.log('Featured categories from mock:', featured);
          if (Array.isArray(featured)) {
            setFeaturedCategories(featured);
          } else {
            setFeaturedCategories([]);
          }
        }
      } catch (error) {
        console.error('Error loading featured listings:', error);
        setFeaturedCategories([]); // Ensure we always have an array
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedListings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hotel Search Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookingCard />
      </div>
      
      {showCategoryView ? (
        /* Category Sections - 9 rows as requested */
        <div className="space-y-0">
          {featuredCategories && featuredCategories.length > 0 ? (
            featuredCategories.map((category, index) => (
              <div 
                key={category.id} 
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <CategorySection
                  title={category.name}
                  listings={category.listings}
                  totalCount={category.totalCount}
                  showViewAll={true}
                  onCategoryClick={handleCategoryClick}
                  categoryType={category.type || (category.types && category.types[0]) || category.id}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('common.loading')}</p>
            </div>
          )}
        </div>
      ) : (
        /* Filtered Listings View */
        <div>
          <div className="bg-white border-b border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center text-[#ff385c] hover:text-[#e0314f] font-medium transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('home.backToCategories')}
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedCategory ? `${selectedCategory} Properties` : 'All Properties'}
                </h1>
              </div>
            </div>
          </div>
          <ListingsGrid activeFilter={activeFilter} />
        </div>
      )}

      {/* Additional Message if few categories */}
      {showCategoryView && featuredCategories.length < 5 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              More amazing stays coming soon!
            </h2>
            <p className="text-gray-600 text-lg">
              We're constantly adding new and exciting properties to our collection.
            </p>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default Home;