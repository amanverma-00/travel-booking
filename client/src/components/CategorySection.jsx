import React from 'react';
import { useTranslation } from 'react-i18next';
import ListingCard from './ListingCard';

const CategorySection = ({ 
  title, 
  listings, 
  showViewAll = true,
  maxDisplay = null,
  onCategoryClick,
  categoryType 
}) => {
  const { t } = useTranslation();
  const displayListings = maxDisplay ? listings.slice(0, maxDisplay) : listings;

  if (!listings || listings.length === 0) {
    return null;
  }

  const handleCategoryClick = () => {
    if (onCategoryClick) {
      onCategoryClick(categoryType);
    }
  };

  const handleViewAllClick = () => {
    if (onCategoryClick) {
      onCategoryClick(categoryType);
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-[#ff385c] transition-colors duration-200"
              onClick={handleCategoryClick}
            >
              {title}
            </h2>
            <p className="text-gray-600 text-base">
              {t('categories.discover', { category: title.toLowerCase() })}
            </p>
          </div>
          {showViewAll && listings.length > maxDisplay && (
            <button 
              onClick={handleViewAllClick}
              className="hidden lg:flex items-center text-[#ff385c] hover:text-[#e0314f] font-medium text-lg transition-colors duration-200 group"
            >
              <span>{t('categories.viewAll', { count: listings.length })}</span>
              <svg 
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
        </div>

        {/* Listings Grid - Fill screen width with 5 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayListings.map((listing, index) => (
            <div 
              key={`${title}-${listing._id || index}`} 
              className="transform hover:scale-105 transition-transform duration-300"
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>

        {/* Show more button for mobile and small screens */}
        {showViewAll && listings.length > maxDisplay && (
          <div className="mt-8 text-center lg:hidden">
            <button 
              onClick={handleViewAllClick}
              className="bg-[#ff385c] text-white px-8 py-3 rounded-full hover:bg-[#e0314f] transition-colors duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('categories.viewAllMobile', { count: listings.length, category: title.toLowerCase() })}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;