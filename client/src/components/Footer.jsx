import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Safety information
                </Link>
              </li>
              <li>
                <Link to="/cancellation" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Cancellation options
                </Link>
              </li>
              <li>
                <Link to="/disability-support" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Anti-discrimination
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Report neighborhood concern
                </Link>
              </li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Hosting</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/become-a-host" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Wanderlust your home
                </Link>
              </li>
              <li>
                <Link to="/host-cover" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  WanderlustCover for Hosts
                </Link>
              </li>
              <li>
                <Link to="/hosting-resources" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Hosting resources
                </Link>
              </li>
              <li>
                <Link to="/community-forum" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Community forum
                </Link>
              </li>
              <li>
                <Link to="/hosting-responsibly" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Hosting responsibly
                </Link>
              </li>
            </ul>
          </div>

          {/* Wanderlust */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Wanderlust</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/newsroom" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link to="/new-features" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  New features
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/investors" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Investors
                </Link>
              </li>
              <li>
                <Link to="/emergency-stays" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Wanderlust.org emergency stays
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info & Social */}
          <div>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[#ff385c] hover:text-white transition-colors"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[#ff385c] hover:text-white transition-colors"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[#ff385c] hover:text-white transition-colors"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[#ff385c] hover:text-white transition-colors"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            {/* Language & Currency */}
            <div className="space-y-3">
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <FaGlobe className="w-4 h-4" />
                <span>English (IN)</span>
              </button>
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <span>₹</span>
                <span>INR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright & Links */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-600">
                © 2025 Wanderlust, Inc.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy
                </Link>
                <span className="text-gray-400">·</span>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms
                </Link>
                <span className="text-gray-400">·</span>
                <Link to="/sitemap" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Sitemap
                </Link>
                <span className="text-gray-400">·</span>
                <Link to="/company-details" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Company details
                </Link>
              </div>
            </div>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#ff385c] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
              <span className="text-lg font-bold text-[#ff385c]">wanderlust</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;