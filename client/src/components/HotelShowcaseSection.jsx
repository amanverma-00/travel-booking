import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const HotelShowcaseSection = () => {
  const hotels = [
    {
      id: 1,
      name: "Luxury Ocean Resort",
      location: "Maldives",
      price: "$299",
      rating: 4.9,
      reviews: 123,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop&crop=center",
      amenities: ["Pool", "Spa", "Restaurant", "WiFi"]
    },
    {
      id: 2,
      name: "Mountain View Lodge",
      location: "Swiss Alps",
      price: "$179",
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop&crop=center",
      amenities: ["Fireplace", "Balcony", "Hiking", "WiFi"]
    },
    {
      id: 3,
      name: "City Center Hotel",
      location: "New York",
      price: "$149",
      rating: 4.7,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop&crop=center",
      amenities: ["Gym", "Business Center", "Restaurant", "WiFi"]
    },
    {
      id: 4,
      name: "Beach Paradise Resort",
      location: "Bali",
      price: "$199",
      rating: 4.9,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&crop=center",
      amenities: ["Beach Access", "Pool", "Spa", "Restaurant"]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Hotels
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium accommodations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
              <div className="relative overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg shadow-md">
                  <span className="text-sm font-semibold text-gray-900">{hotel.price}/night</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {hotel.name}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <FaMapMarkerAlt className="mr-1 text-sm" />
                  <span className="text-sm">{hotel.location}</span>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-2">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="ml-1 text-sm font-medium text-gray-900">{hotel.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({hotel.reviews} reviews)</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {hotel.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {amenity}
                    </span>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{hotel.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelShowcaseSection;