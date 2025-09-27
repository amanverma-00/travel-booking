import { FaCalendarTimes, FaGlobe, FaFilter } from 'react-icons/fa';

const FlexibilitySection = () => {
  const features = [
    {
      icon: <FaCalendarTimes className="text-3xl text-blue-600" />,
      title: "Enjoy some flexibility",
      description: "Stays with flexible cancellation make it easy to rebook if your plans change."
    },
    {
      icon: <FaGlobe className="text-3xl text-blue-600" />,
      title: "More than 7M active listings",
      description: "Join more than 1 billion guests who've found getaways in over 220 countries and destinations."
    },
    {
      icon: <FaFilter className="text-3xl text-blue-600" />,
      title: "100+ filters for tailored stays",
      description: "Pick your price range, the number of rooms you want and other key amenities to find the stay that fits your needs."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlexibilitySection;