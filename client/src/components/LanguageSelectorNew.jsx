import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';

const languages = {
  en: { nativeName: 'English', flag: '🇺🇸' },
  hi: { nativeName: 'हिन्दी', flag: '🇮🇳' },
  ta: { nativeName: 'தமிழ்', flag: '🇮🇳' },
  te: { nativeName: 'తెలుగు', flag: '🇮🇳' },
  mr: { nativeName: 'मराठी', flag: '🇮🇳' },
  bn: { nativeName: 'বাংলা', flag: '🇧🇩' },
  gu: { nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  es: { nativeName: 'Español', flag: '🇪🇸' }
};

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
        aria-label={t('language.select')}
      >
        <FaGlobe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languages[i18n.language]?.nativeName || 'English'}
        </span>
        <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
            {t('language.select')}
          </div>
          {Object.entries(languages).map(([code, { nativeName, flag }]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                i18n.language === code ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{flag}</span>
                <span>{nativeName}</span>
              </div>
              {i18n.language === code && (
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;