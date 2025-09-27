import { FaHome, FaBuilding, FaBed } from 'react-icons/fa';

const PropertyTypesSection = () => {
  const propertyTypes = [
    {
      icon: <FaHome className="text-4xl text-blue-600 mb-4" />,
      title: "Houses",
      description: "If you need extra space, get an entire place all to yourself.",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&crop=center"
    },
    {
      icon: <FaBuilding className="text-4xl text-blue-600 mb-4" />,
      title: "Flats",
      description: "Stay in some of the most convenient locations with spaces in shared buildings.",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&crop=center"
    },
    {
      icon: <FaBed className="text-4xl text-blue-600 mb-4" />,
      title: "Rooms",
      description: "Enjoy your own sleeping space and share a common area with others.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop&crop=center"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Big, small, we have it all
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from millions of homes and experiences around the world
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {propertyTypes.map((type, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img 
                  src={type.image} 
                  alt={type.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center">
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {type.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {type.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypesSection;