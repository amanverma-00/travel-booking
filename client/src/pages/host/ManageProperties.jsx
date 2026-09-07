import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  StarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

const ManageProperties = () => {
  const { t } = useLanguage();
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchHostProperties();
  }, []);

  const fetchHostProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch('/api/listings/host/my-listings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data.data || []);
      } else {
        console.error('Failed to fetch properties:', response.status);
        toast.error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!confirm(t('host.confirmDeleteProperty'))) return;

    setDeletingId(propertyId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(`/api/listings/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success(t('host.propertyDeleted'));
        fetchHostProperties(); // Refresh the list
      } else {
        toast.error(t('host.deletePropertyError'));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error(t('common.error'));
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {t(`property.status.${status}`)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 rounded-lg shadow h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('host.manageProperties')}</h1>
          <p className="mt-2 text-gray-600">{t('host.managePropertiesDesc')}</p>
        </div>
        <Link
          to="/become-host"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          {t('host.addNewProperty')}
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">{t('host.noProperties')}</h3>
          <p className="mt-2 text-gray-500">{t('host.noPropertiesDesc')}</p>
          <div className="mt-6">
            <Link
              to="/become-host"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {t('host.createFirstProperty')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Property Image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={getImageUrl(property.images[0])}
                    alt={property.title}
                    onError={(e) => handleImageError(e)}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                    <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Property Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {property.title}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {property.city}, {property.state}
                    </div>
                  </div>
                  {getStatusBadge(property.status || 'active')}
                </div>

                {/* Property Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('property.propertyType')}:</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('property.roomType')}:</span>
                    <span className="font-medium">{property.roomType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('property.guests')}:</span>
                    <span className="font-medium">{property.maxGuests} {t('common.guests')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('property.basePrice')}:</span>
                    <div className="flex items-center font-medium">
                      <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                      {property.basePrice?.toLocaleString()}/{t('common.night')}
                    </div>
                  </div>
                </div>

                {/* Property Stats */}
                {property.rating && (
                  <div className="flex items-center mb-4">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{property.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">
                      ({property.reviewCount || 0} {t('common.reviews')})
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/listing/${property._id}`)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {t('common.view')}
                  </button>
                  
                  <button
                    onClick={() => navigate(`/host/edit-property/${property._id}`)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    {t('common.edit')}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteProperty(property._id)}
                    disabled={deletingId === property._id}
                    className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProperties;