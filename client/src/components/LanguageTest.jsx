import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelectorNew from './LanguageSelectorNew';

const LanguageTest = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Language Test Page
            </h1>
            <LanguageSelectorNew />
          </div>
          
          <div className="space-y-6">
            {/* Current Language Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Current Language: {i18n.language}
              </h2>
              <p className="text-blue-700">
                {t('language.current')}: {i18n.language.toUpperCase()}
              </p>
            </div>
            
            {/* Navigation Translations */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Navigation</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">nav.home</div>
                  <div className="font-medium">{t('nav.home')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">nav.becomeHost</div>
                  <div className="font-medium">{t('nav.becomeHost')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">nav.messages</div>
                  <div className="font-medium">{t('nav.messages')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-500">nav.login</div>
                  <div className="font-medium">{t('nav.login')}</div>
                </div>
              </div>
            </div>
            
            {/* Home Page Translations */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Home Page</h3>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-green-600">home.hero.title</div>
                  <div className="font-medium">{t('home.hero.title')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-green-600">home.hero.subtitle</div>
                  <div className="font-medium">{t('home.hero.subtitle')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-green-600">home.searchPlaceholder</div>
                  <div className="font-medium">{t('home.searchPlaceholder')}</div>
                </div>
              </div>
            </div>
            
            {/* Booking Translations */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Booking</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-purple-600">booking.checkIn</div>
                  <div className="font-medium">{t('booking.checkIn')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-purple-600">booking.checkOut</div>
                  <div className="font-medium">{t('booking.checkOut')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-purple-600">booking.guests</div>
                  <div className="font-medium">{t('booking.guests')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-purple-600">booking.book</div>
                  <div className="font-medium">{t('booking.book')}</div>
                </div>
              </div>
            </div>
            
            {/* Property Types */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">Property Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-orange-600">propertyTypes.hotels</div>
                  <div className="font-medium">{t('propertyTypes.hotels')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-orange-600">propertyTypes.apartments</div>
                  <div className="font-medium">{t('propertyTypes.apartments')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-orange-600">propertyTypes.villas</div>
                  <div className="font-medium">{t('propertyTypes.villas')}</div>
                </div>
              </div>
            </div>
            
            {/* Common Phrases */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Common Phrases</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-red-600">common.loading</div>
                  <div className="font-medium">{t('common.loading')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-red-600">common.save</div>
                  <div className="font-medium">{t('common.save')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-red-600">common.cancel</div>
                  <div className="font-medium">{t('common.cancel')}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-red-600">common.success</div>
                  <div className="font-medium">{t('common.success')}</div>
                </div>
              </div>
            </div>
            
            {/* Debug Information */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Debug Information</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div><strong>Current Language:</strong> {i18n.language}</div>
                <div><strong>Resolved Language:</strong> {i18n.resolvedLanguage}</div>
                <div><strong>Fallback Language:</strong> {i18n.options.fallbackLng}</div>
                <div><strong>Supported Languages:</strong> {i18n.options.supportedLngs?.join(', ')}</div>
                <div><strong>Backend Status:</strong> {i18n.services.backendConnector ? 'Connected' : 'Not Connected'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap with Suspense for lazy loading
const LanguageTestWithSuspense = () => (
  <Suspense fallback={
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-gray-600">Loading translations...</div>
      </div>
    </div>
  }>
    <LanguageTest />
  </Suspense>
);

export default LanguageTestWithSuspense;