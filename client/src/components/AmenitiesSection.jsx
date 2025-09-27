import { FaWifi, FaSwimmingPool, FaSpa, FaDumbbell, FaUtensils, FaCar, FaConciergeBell, FaPaw, FaBusinessTime, FaWineGlass, FaUmbrellaBeach, FaBaby } from 'react-icons/fa';

const AmenitiesSection = () => {
  const amenities = [
    { icon: <FaWifi />, name: "Free WiFi", description: "Stay connected with high-speed internet" },
    { icon: <FaSwimmingPool />, name: "Swimming Pool", description: "Relax and unwind in our pools" },
    { icon: <FaSpa />, name: "Spa & Wellness", description: "Rejuvenate with our spa services" },
    { icon: <FaDumbbell />, name: "Fitness Center", description: "Stay fit with modern equipment" },
    { icon: <FaUtensils />, name: "Restaurant", description: "Dine at our world-class restaurants" },
    { icon: <FaCar />, name: "Parking", description: "Complimentary parking available" },
    { icon: <FaConciergeBell />, name: "Concierge", description: "24/7 concierge services" },
    { icon: <FaPaw />, name: "Pet Friendly", description: "Your furry friends are welcome" },
    { icon: <FaBusinessTime />, name: "Business Center", description: "Fully equipped business facilities" },
    { icon: <FaWineGlass />, name: "Bar & Lounge", description: "Enjoy drinks at our bars" },
    { icon: <FaUmbrellaBeach />, name: "Beach Access", description: "Direct access to pristine beaches" },
    { icon: <FaBaby />, name: "Family Friendly", description: "Kid-friendly amenities and services" }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Premium Amenities
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Enjoy world-class facilities and services designed for your comfort and convenience
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
              <div className="text-3xl text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                {amenity.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {amenity.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {amenity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;