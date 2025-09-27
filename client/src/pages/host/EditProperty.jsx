import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const EditProperty = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    roomType: '',
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    basePrice: '',
    cleaningFee: '',
    amenities: [],
    houseRules: '',
    cancellationPolicy: 'moderate'
  });

  const propertyTypes = [
    'House', 'Apartment', 'Hotel', 'Villa', 'Cottage', 'Condo',
    'Loft', 'Townhouse', 'Guesthouse', 'Bed & Breakfast', 'Other'
  ];

  const roomTypes = [
    'Entire place', 'Private room', 'Shared room', 'Hotel room'
  ];

  // Mapping functions to convert between display values and database values
  const propertyTypeToDb = {
    'House': 'house',
    'Apartment': 'apartment', 
    'Hotel': 'hotel',
    'Villa': 'villa',
    'Cottage': 'cottage',
    'Condo': 'condo',
    'Loft': 'loft',
    'Townhouse': 'townhouse',
    'Guesthouse': 'guesthouse',
    'Bed & Breakfast': 'bed_breakfast',
    'Other': 'other'
  };

  const propertyTypeFromDb = Object.fromEntries(
    Object.entries(propertyTypeToDb).map(([key, value]) => [value, key])
  );

  const roomTypeToDb = {
    'Entire place': 'entire_place',
    'Private room': 'private_room',
    'Shared room': 'shared_room',
    'Hotel room': 'hotel_room'
  };

  const roomTypeFromDb = Object.fromEntries(
    Object.entries(roomTypeToDb).map(([key, value]) => [value, key])
  );

  const availableAmenities = [
    'WiFi', 'Kitchen', 'Parking', 'Pool', 'Gym', 'Air Conditioning',
    'Heating', 'TV', 'Washer', 'Dryer', 'Iron', 'Hair Dryer',
    'Hot Tub', 'Balcony', 'Garden', 'Beach Access', 'Fireplace'
  ];

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        navigate('/host/manage-properties');
        return;
      }

      const response = await fetch(`/api/listings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const propertyData = data.data;
        setProperty(propertyData);
        
        // Populate form with existing data
        setFormData({
          title: propertyData.title || '',
          description: propertyData.description || '',
          propertyType: propertyTypeFromDb[propertyData.propertyType] || '',
          roomType: roomTypeFromDb[propertyData.roomType] || '',
          maxGuests: propertyData.capacity?.maxGuests || 1,
          bedrooms: propertyData.capacity?.bedrooms || 1,
          beds: propertyData.capacity?.beds || 1,
          bathrooms: propertyData.capacity?.bathrooms || 1,
          address: propertyData.location?.address || '',
          city: propertyData.location?.city || '',
          state: propertyData.location?.state || '',
          country: propertyData.location?.country || '',
          zipCode: propertyData.location?.zipCode || '',
          basePrice: propertyData.pricing?.basePrice || '',
          cleaningFee: propertyData.pricing?.cleaningFee || '',
          amenities: propertyData.amenities || [],
          houseRules: propertyData.houseRules || '',
          cancellationPolicy: propertyData.cancellationPolicy || 'moderate'
        });
      } else {
        toast.error(t('property.fetchError'));
        navigate('/host/manage-properties');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error(t('common.error'));
      navigate('/host/manage-properties');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      // Transform formData to match the expected schema structure
      const updateData = {
        title: formData.title,
        description: formData.description,
        propertyType: propertyTypeToDb[formData.propertyType] || formData.propertyType.toLowerCase(),
        roomType: roomTypeToDb[formData.roomType] || formData.roomType.toLowerCase().replace(/ /g, '_'),
        capacity: {
          maxGuests: parseInt(formData.maxGuests),
          bedrooms: parseInt(formData.bedrooms),
          beds: parseInt(formData.beds),
          bathrooms: parseInt(formData.bathrooms)
        },
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode
        },
        pricing: {
          basePrice: parseFloat(formData.basePrice),
          cleaningFee: parseFloat(formData.cleaningFee) || 0
        },
        amenities: formData.amenities,
        houseRules: formData.houseRules,
        cancellationPolicy: formData.cancellationPolicy
      };

      const response = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        toast.success(t('property.updateSuccess'));
        navigate('/host/manage-properties');
      } else {
        const error = await response.json();
        toast.error(error.message || t('property.updateError'));
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('property.editProperty')}</h1>
        <p className="mt-2 text-gray-600">{t('property.editPropertyDesc')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('property.basicInfo')}</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('property.title')}</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('property.description')}</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('property.propertyType')}</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">{t('property.selectPropertyType')}</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('property.roomType')}</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">{t('property.selectRoomType')}</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('property.maxGuests')}</label>
                <input
                  type="number"
                  name="maxGuests"
                  min="1"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('property.bedrooms')}</label>
                <input
                  type="number"
                  name="bedrooms"
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('property.beds')}</label>
                <input
                  type="number"
                  name="beds"
                  min="1"
                  value={formData.beds}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('property.bathrooms')}</label>
                <input
                  type="number"
                  name="bathrooms"
                  min="0"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('property.location')}</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('property.address')}</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('property.city')}</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('property.state')}</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('property.zipCode')}</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('property.pricing')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('property.basePrice')}</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="basePrice"
                  min="0"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  required
                  className="pl-7 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('property.cleaningFee')}</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="cleaningFee"
                  min="0"
                  value={formData.cleaningFee}
                  onChange={handleInputChange}
                  className="pl-7 block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('property.amenities')}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableAmenities.map(amenity => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="ml-2 text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* House Rules */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('property.houseRules')}</h2>
          
          <div>
            <textarea
              name="houseRules"
              rows={4}
              value={formData.houseRules}
              onChange={handleInputChange}
              placeholder={t('property.houseRulesPlaceholder')}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/host/manage-properties')}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? t('common.saving') : t('common.saveChanges')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;