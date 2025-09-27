import { useState } from 'react';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = ({ className = '' }) => {
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languageNames = {
    en: 'English',
    hi: 'हिन्दी',
    ta: 'தமிழ்',
    te: 'తెలుగు',
    mr: 'मराठी',
    bn: 'বাংলা',
    gu: 'ગુજરાતી',
    es: 'Español'
  };

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    setIsOpen(false);
  };

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors border border-gray-300 rounded-md hover:border-pink-600"
        type="button"
      >
        <FaGlobe className="w-4 h-4" />
        <span className="hidden md:inline">{languageNames[language]}</span>
        <FaChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
            <div className="py-1">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    language === lang ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-700'
                  }`}
                  type="button"
                >
                  <div className="flex items-center justify-between">
                    <span>{languageNames[lang]}</span>
                    {language === lang && (
                      <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;