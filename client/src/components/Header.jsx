import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaUser, FaBars, FaTimes, FaGlobe, FaHeart, FaCalendar, FaCreditCard } from 'react-icons/fa';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';
import LanguageSelectorNew from './LanguageSelectorNew';
import { getImageUrl } from '../utils/imageUtils';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    dispatch(logout());
    toast.success(t('common.success'));
    setIsProfileMenuOpen(false);
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#ff385c] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-2xl font-bold text-[#ff385c]">{t('nav.websiteName')}</span>
            </Link>
          </div>

          {/* Home Button - Center */}
          <div className="hidden md:flex">
            <Link 
              to="/" 
              className="text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-full font-medium transition-colors"
            >
              {t('nav.home')}
            </Link>
          </div>

          {/* Desktop Navigation - Right */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/become-host" 
              className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-full font-medium transition-colors"
            >
              {t('nav.becomeHost')}
            </Link>
            
            <LanguageSelectorNew />
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 border border-gray-300 rounded-full py-2 px-3 hover:shadow-md transition-shadow"
                >
                  <FaBars className="w-3 h-3 text-gray-700" />
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.profileImage ? (
                      <img 
                        src={getImageUrl(user.profileImage, '')} 
                        alt="Profile" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-white">
                        {user?.firstName?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{t('nav.welcome')}, {user?.firstName}</p>
                    </div>
                    <Link 
                      to="/wishlist" 
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <FaHeart className="mr-2 text-pink-600" />
                        {t('nav.wishlist')}
                      </div>
                      {wishlistItems.length > 0 && (
                        <span className="bg-pink-600 text-white text-xs rounded-full px-2 py-1">
                          {wishlistItems.length}
                        </span>
                      )}
                    </Link>
                    <Link 
                      to="/my-bookings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <FaCalendar className="mr-2 text-blue-600" />
                        {t('nav.myBookings')}
                      </div>
                    </Link>
                    <Link 
                      to="/my-payments" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <FaCreditCard className="mr-2 text-green-600" />
                        My Payments
                      </div>
                    </Link>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      {t('nav.profile')}
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      {(user?.role === 'host' || user?.role === 'admin') && (
                        <>
                          <Link 
                            to="/host/dashboard" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            {t('host.dashboard')}
                          </Link>
                          <Link 
                            to="/host/bookings" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            {t('host.bookings')}
                          </Link>
                          <Link 
                            to="/host/analytics" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            {t('host.analytics')}
                          </Link>
                          <div className="border-t border-gray-100 my-2"></div>
                        </>
                      )}
                      <Link 
                        to="/become-host" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        {user?.role === 'host' || user?.role === 'admin' ? t('host.manageProperties') : t('nav.becomeHost')}
                      </Link>
                      <Link 
                        to="/help" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        {t('nav.help')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-full font-medium transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-[#ff385c] text-white px-4 py-2 rounded-full hover:bg-[#e0314f] transition-colors font-medium"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <FaUser className="w-4 h-4 text-white" />
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#ff385c] transition-colors"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Welcome, {user?.firstName}
                  </div>
                  <Link 
                    to="/wishlists" 
                    className="text-gray-700 hover:text-[#ff385c] font-medium px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlists
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-[#ff385c] font-medium px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <Link 
                      to="/become-a-host" 
                      className="text-gray-700 hover:text-[#ff385c] font-medium px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Become a Host
                    </Link>
                    <Link 
                      to="/help" 
                      className="text-gray-700 hover:text-[#ff385c] font-medium px-3 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Help
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-[#ff385c] font-medium px-3 py-2 text-left w-full"
                    >
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-[#ff385c] font-medium px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-700 hover:text-[#ff385c] font-medium px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.signup')}
                  </Link>
                  <Link 
                    to="/become-a-host" 
                    className="text-gray-700 hover:text-[#ff385c] font-medium px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.becomeHost')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;