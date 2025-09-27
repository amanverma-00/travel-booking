import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaExpand, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ListingMap = ({ listing }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { coordinates } = listing.location || {};
  
  if (!coordinates || !coordinates.lat || !coordinates.lng) {
    return (
      <div className="bg-gray-100 h-64 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Location not available</p>
      </div>
    );
  }

  const position = [coordinates.lat, coordinates.lng];

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const MapComponent = ({ className, zoom = 13 }) => (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      className={className}
      key={isFullscreen ? 'fullscreen' : 'normal'} // Force re-render when toggling
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <div className="p-2">
            <h3 className="font-semibold text-sm">{listing.title}</h3>
            <p className="text-xs text-gray-600 mt-1">
              {listing.location.address}, {listing.location.city}
            </p>
            <p className="text-xs font-medium text-blue-600 mt-1">
              ${listing.pricing.basePrice}/night
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );

  return (
    <>
      {/* Regular Map View */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
        <MapComponent className="h-full w-full" />
        
        {/* Expand Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg shadow-lg transition-colors z-[1000] flex items-center space-x-2"
          title="View full map"
        >
          <FaExpand className="text-sm" />
          <span className="text-sm font-medium hidden sm:inline">Full Map</span>
        </button>
      </div>

      {/* Fullscreen Map Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm p-4 z-[10000] border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-pink-600" />
                  <div>
                    <h3 className="font-semibold text-lg">{listing.title}</h3>
                    <p className="text-sm text-gray-600">
                      {listing.location.address}, {listing.location.city}, {listing.location.state}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Close full map"
                >
                  <FaTimes className="text-xl text-gray-700" />
                </button>
              </div>
            </div>

            {/* Fullscreen Map */}
            <div className="w-full h-full pt-20">
              <MapComponent className="h-full w-full" zoom={15} />
            </div>

            {/* Property Info Card */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
              <div className="flex items-start space-x-3">
                <img
                  src={listing.images?.[0] || 'https://via.placeholder.com/60x60'}
                  alt={listing.title}
                  className="w-15 h-15 rounded-lg object-cover flex-shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-sm">{listing.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {listing.propertyType} • {listing.capacity?.bedrooms || 0} bed • {listing.capacity?.bathrooms || 0} bath
                  </p>
                  <p className="text-sm font-medium text-pink-600 mt-1">
                    ${listing.pricing.basePrice}/night
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-yellow-600">★</span>
                    <span className="text-xs text-gray-600 ml-1">
                      {listing.ratingsAverage || 'New'} ({listing.ratingsQuantity || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListingMap;