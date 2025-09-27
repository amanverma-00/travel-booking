import { useState } from 'react';
import { 
  FaHome, 
  FaCity, 
  FaLandmark, 
  FaLeaf, 
  FaUmbrellaBeach, 
  FaMountain, 
  FaHeart, 
  FaMapMarkerAlt,
  FaFortAwesome,
  FaTree,
  FaWater
} from 'react-icons/fa';

const PropertyFilters = ({ activeFilter, onFilterChange }) => {
  const cityFilters = [
    { 
      id: 'all', 
      label: 'All', 
      icon: FaHome 
    },
    { 
      id: 'Mumbai', 
      label: 'Mumbai', 
      icon: FaCity 
    },
    { 
      id: 'Delhi', 
      label: 'Delhi', 
      icon: FaLandmark 
    },
    { 
      id: 'Bangalore', 
      label: 'Bangalore', 
      icon: FaLeaf 
    },
    { 
      id: 'Mysore', 
      label: 'Mysore', 
      icon: FaMapMarkerAlt 
    },
    { 
      id: 'Hyderabad', 
      label: 'Hyderabad', 
      icon: FaHeart 
    },
    { 
      id: 'Jaipur', 
      label: 'Jaipur', 
      icon: FaFortAwesome 
    },
    { 
      id: 'Goa', 
      label: 'Goa', 
      icon: FaUmbrellaBeach 
    },
    { 
      id: 'Dehradun', 
      label: 'Dehradun', 
      icon: FaMountain 
    },
    { 
      id: 'Kolkata', 
      label: 'Kolkata', 
      icon: FaLandmark 
    },
    { 
      id: 'Lucknow', 
      label: 'Lucknow', 
      icon: FaTree 
    },
    { 
      id: 'Chennai', 
      label: 'Chennai', 
      icon: FaWater 
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {cityFilters.map((city) => {
              const IconComponent = city.icon;
              const isActive = activeFilter === city.id;
              
              return (
                <button
                  key={city.id}
                  onClick={() => onFilterChange(city.id)}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200 whitespace-nowrap min-w-max ${
                    isActive
                      ? 'text-[#ff385c] border-b-2 border-[#ff385c] bg-red-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className={`w-6 h-6 ${isActive ? 'text-[#ff385c]' : 'text-gray-500'}`} />
                  <span className={`text-xs font-medium ${isActive ? 'text-[#ff385c]' : 'text-gray-600'}`}>
                    {city.label}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Filter Toggle Button - Mobile */}
          <div className="md:hidden">
            <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586l-4-4V9.414L3.293 4.707A1 1 0 013 4.586V4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;