import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateProfile } from '../store/authSlice';
import { FaEdit, FaCamera, FaMapMarkerAlt, FaLanguage, FaCalendarAlt, FaStar, FaPlane, FaHome, FaChartLine, FaWallet, FaClock, FaUsers } from 'react-icons/fa';
import { MdLocationOn, MdDashboard } from 'react-icons/md';
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    languages: user?.languages || [],
    phone: user?.phone || ''
  });

  const [formData, setFormData] = useState({
    name: user?.firstName || '',
    email: user?.emailId || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    const initializeProfile = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      if (isAuthenticated && user && !dataFetched) {
        fetchUserData();
      } else if (isAuthenticated && user && dataFetched) {
        setLoading(false);
      } else if (token && !isAuthenticated) {
        setTimeout(() => {
          if (isAuthenticated && !dataFetched) {
            fetchUserData();
          } else {
            setLoading(false);
          }
        }, 100);
      } else {
        setLoading(false);
      }
    };

    if (user) {
      setFormData({
        name: user.firstName || '',
        email: user.emailId || '',
        phone: user.phone || ''
      });
      
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        languages: user.languages || [],
        phone: user.phone || ''
      });
    }
    
    initializeProfile();
  }, [user, isAuthenticated, dataFetched]);

  const fetchUserData = async () => {
    if (dataFetched) return;
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        toast.error('Please login again');
        window.location.href = '/login';
        return;
      }
      
      setDataFetched(true);
      
      const profileResponse = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = profileResponse.data.user;
      console.log('Updated user data from server:', userData);
      dispatch(updateProfile(userData));
      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        bio: userData.bio || '',
        location: userData.location || '',
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
        languages: userData.languages || [],
        phone: userData.phone || ''
      });

      setFormData({
        name: userData.firstName || '',
        email: userData.emailId || '',
        phone: userData.phone || ''
      });
      
      const reviewsResponse = await axios.get('/api/reviews/my-reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviewsResponse.data);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setDataFetched(false);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      } else if (error.response?.status === 404) {
        toast.error('User profile not found. Please try logging in again.');
      } else {
        toast.error('Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (e) => {
    const languages = e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang);
    setProfileData(prev => ({
      ...prev,
      languages
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        window.location.href = '/login';
        return;
      }
      
      const response = await axios.put('/api/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      dispatch(updateProfile(response.data.user));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/profile', {
        firstName: formData.name,
        phone: formData.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      dispatch(updateProfile(response.data.user));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.firstName || '',
      email: user?.emailId || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append('profileImage', file);

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        window.location.href = '/login';
        return;
      }
      
      const response = await axios.post('/api/auth/upload-profile-image', formDataImg, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      dispatch(updateProfile(response.data.user));
      
      toast.success('Profile image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const hasProfileData = user?.bio || user?.location || user?.dateOfBirth || user?.languages?.length > 0;

  const token = localStorage.getItem('token');
  
  // Show loading while authentication state is being restored
  if (token && !isAuthenticated && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  // Only show access denied if there's no token at all
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please login to view your profile.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-[#ff385c] text-white px-6 py-2 rounded-lg hover:bg-[#e31c5f] transition-colors font-medium"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ff385c]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug info - remove after fixing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 p-2 text-xs">
          Debug: User Role = {user?.role}, IsAuth = {isAuthenticated ? 'Yes' : 'No'}
        </div>
      )}
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {user?.profileImage?.url ? (
                  <img 
                    src={user.profileImage.url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold text-gray-600">
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#ff385c] text-white p-2 rounded-full cursor-pointer hover:bg-[#e31c5f] transition-colors">
                <FaCamera className="w-3 h-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600">{user?.emailId}</p>
              <p className="text-sm text-blue-600">Role: {user?.role}</p>
              {user?.location && (
                <div className="flex items-center text-gray-600 mt-1">
                  <MdLocationOn className="w-4 h-4 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
            
            {/* Refresh Profile Button */}
            <div>
              <button
                onClick={() => {
                  setDataFetched(false);
                  fetchUserData();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Refresh Profile
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'about'
                    ? 'border-[#ff385c] text-[#ff385c]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                About me
              </button>
              {(user?.role === 'host' || user?.role === 'admin') && (
                <button
                  onClick={() => setActiveTab('host')}
                  className={`py-4 border-b-2 font-medium text-sm ${
                    activeTab === 'host'
                      ? 'border-[#ff385c] text-[#ff385c]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Host Management
                </button>
              )}
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-[#ff385c] text-[#ff385c]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* About Me Tab */}
            {activeTab === 'about' && (
              <div>
                {!isEditing ? (
                  <div>
                    {hasProfileData ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-semibold text-gray-900">About</h2>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <FaEdit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                        </div>
                        
                        {user?.bio && (
                          <div>
                            <h3 className="font-medium text-gray-900 mb-2">Bio</h3>
                            <p className="text-gray-700">{user.bio}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {user?.location && (
                            <div className="flex items-center space-x-3">
                              <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">Lives in</p>
                                <p className="text-gray-700">{user.location}</p>
                              </div>
                            </div>
                          )}

                          {user?.dateOfBirth && (
                            <div className="flex items-center space-x-3">
                              <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">Born</p>
                                <p className="text-gray-700">
                                  {new Date(user.dateOfBirth).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          )}

                          {user?.languages?.length > 0 && (
                            <div className="flex items-center space-x-3">
                              <FaLanguage className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">Languages</p>
                                <p className="text-gray-700">{user.languages.join(', ')}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaEdit className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Complete your profile
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Add your personal information to help others get to know you better.
                        </p>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-[#ff385c] text-white px-6 py-3 rounded-lg hover:bg-[#e31c5f] transition-colors font-medium"
                        >
                          Get Started
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        maxLength={500}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
                        placeholder="Tell us about yourself..."
                      />
                      <p className="text-sm text-gray-500 mt-1">{profileData.bio.length}/500</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={profileData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Languages (comma separated)
                        </label>
                        <input
                          type="text"
                          value={profileData.languages.join(', ')}
                          onChange={handleLanguageChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
                          placeholder="English, Spanish, French"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-[#ff385c] text-white px-6 py-2 rounded-lg hover:bg-[#e31c5f] transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Host Management Tab */}
            {activeTab === 'host' && (user?.role === 'host' || user?.role === 'admin') && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Host Management</h2>
                  <p className="text-gray-600">Manage your properties, bookings, and host analytics</p>
                </div>

                {/* Host Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {/* Dashboard Card */}
                  <Link
                    to="/host/dashboard"
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <MdDashboard className="h-8 w-8" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">Dashboard</div>
                      </div>
                    </div>
                    <p className="text-pink-100">
                      View your overall performance, stats, and recent activity
                    </p>
                  </Link>

                  {/* Bookings Card */}
                  <Link
                    to="/host/bookings"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <FaUsers className="h-8 w-8" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">Bookings</div>
                      </div>
                    </div>
                    <p className="text-blue-100">
                      Manage guest bookings, approvals, and check-ins
                    </p>
                  </Link>

                  {/* Calendar Card */}
                  <Link
                    to="/host/calendar"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <FaCalendarAlt className="h-8 w-8" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">Calendar</div>
                      </div>
                    </div>
                    <p className="text-green-100">
                      Manage availability, pricing, and blocked dates
                    </p>
                  </Link>

                  {/* Earnings Card */}
                  <Link
                    to="/host/earnings"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <FaWallet className="h-8 w-8" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">Earnings</div>
                      </div>
                    </div>
                    <p className="text-yellow-100">
                      Track your revenue, payouts, and financial reports
                    </p>
                  </Link>

                  {/* Analytics Card */}
                  <Link
                    to="/host/analytics"
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <FaChartLine className="h-8 w-8" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">Analytics</div>
                      </div>
                    </div>
                    <p className="text-purple-100">
                      Advanced insights, trends, and performance metrics
                    </p>
                  </Link>

                  {/* Manage Properties Card */}
                  <Link
                    to="/become-host"
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <FaHome className="h-8 w-8" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">Properties</div>
                      </div>
                    </div>
                    <p className="text-gray-200">
                      Add new listings and manage existing properties
                    </p>
                  </Link>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                      to="/host/bookings?filter=pending"
                      className="flex items-center justify-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <FaClock className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium">Pending Requests</span>
                    </Link>
                    <Link
                      to="/become-host"
                      className="flex items-center justify-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <FaHome className="h-5 w-5 text-pink-600 mr-2" />
                      <span className="text-sm font-medium">Add Listing</span>
                    </Link>
                    <Link
                      to="/host/calendar"
                      className="flex items-center justify-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <FaCalendarAlt className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Update Calendar</span>
                    </Link>
                    <Link
                      to="/host/analytics"
                      className="flex items-center justify-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <FaChartLine className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium">View Insights</span>
                    </Link>
                  </div>
                </div>

                {/* Host Tips */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Host Tips</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>• Keep your calendar updated to avoid booking conflicts</p>
                    <p>• Respond to booking requests within 24 hours for better ratings</p>
                    <p>• Check your analytics regularly to optimize pricing and occupancy</p>
                    <p>• Maintain high-quality photos and detailed descriptions of your property</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Reviews</h2>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            {review.listing?.images?.[0] && (
                              <img
                                src={getImageUrl(review.listing.images[0])}
                                alt={review.listing.title}
                                onError={(e) => handleImageError(e)}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {review.listing?.title || 'Property'}
                              </h3>
                              <div className="flex items-center space-x-1">
                                <FaStar className="w-4 h-4 text-yellow-400" />
                                <span className="font-medium">{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">{review.comment}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaStar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600">
                      When you leave reviews for places you've stayed, they'll appear here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;