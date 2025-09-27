import { FaUtensils, FaSwimmingPool } from 'react-icons/fa';

const FeaturedStaysSection = () => {
  const featuredStays = [
    {
      icon: <FaUtensils className="text-3xl text-blue-600 mb-4" />,
      title: "Family-friendly stays with full kitchens",
      description: "Prepare a feast for loved ones in these stays with kitchens and BBQ grills.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop&crop=center"
    },
    {
      icon: <FaSwimmingPool className="text-3xl text-blue-600 mb-4" />,
      title: "Homes with refreshing pools",
      description: "Relax with your crew by the pool in stays with 2+ bedrooms.",
      image: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=500&h=300&fit=crop&crop=center"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {featuredStays.map((stay, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img 
                  src={stay.image} 
                  alt={stay.title}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center">
                  {stay.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {stay.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {stay.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStaysSection;