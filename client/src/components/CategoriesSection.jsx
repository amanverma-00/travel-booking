import { FaMapMarkerAlt, FaMountain, FaUmbrellaBeach, FaLandmark, FaCity, FaLeaf, FaFortAwesome, FaHeart, FaWater } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CategoriesSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cities = [
    {
      icon: <FaCity />,
      name: t('cities.mumbai.name'),
      count: "47",
      description: t('cities.mumbai.description')
    },
    {
      icon: <FaLandmark />,
      name: t('cities.delhi.name'),
      count: "52",
      description: t('cities.delhi.description')
    },
    {
      icon: <FaLeaf />,
      name: t('cities.bangalore.name'),
      count: "38",
      description: t('cities.bangalore.description')
    },
    {
      icon: <FaMapMarkerAlt />,
      name: t('cities.mysore.name'),
      count: "42",
      description: t('cities.mysore.description')
    },
    {
      icon: <FaUmbrellaBeach />,
      name: t('cities.goa.name'),
      count: "29",
      description: t('cities.goa.description')
    },
    {
      icon: <FaFortAwesome />,
      name: t('cities.jaipur.name'),
      count: "34",
      description: t('cities.jaipur.description')
    },
    {
      icon: <FaMountain />,
      name: t('cities.dehradun.name'),
      count: "28",
      description: t('cities.dehradun.description')
    },
    {
      icon: <FaHeart />,
      name: t('cities.hyderabad.name'),
      count: "41",
      description: t('cities.hyderabad.description')
    },
    {
      icon: <FaWater />,
      name: t('cities.chennai.name'),
      count: "35",
      description: t('cities.chennai.description')
    },
    {
      icon: <FaMapMarkerAlt />,
      name: t('cities.kolkata.name'),
      count: "33",
      description: t('cities.kolkata.description')
    }
  ];

  const handleCityClick = (cityName) => {
    // Navigate to listings page with city filter
    navigate('/');
    // Trigger the city filter
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('filterByCity', { detail: { city: cityName } }));
    }, 100);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('cities.title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('cities.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => handleCityClick(city.name)}
            >
              <div className="text-4xl text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                {city.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {city.name}
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {city.count}+
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {city.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;