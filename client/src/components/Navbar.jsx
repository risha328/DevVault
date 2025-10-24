import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/apiService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showContributionMenu, setShowContributionMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const contributionMenuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    setIsLoggedIn(!!token);
    setUserEmail(email || '');
    setUserName(name || '');

    // Fetch user profile if logged in
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setUserEmail(data.email);
      setUserName(data.name);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', data.name);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to localStorage if API fails
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
    }
  };

  // Close user menu and contribution menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (contributionMenuRef.current && !contributionMenuRef.current.contains(event.target)) {
        setShowContributionMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const guestLinks = [
    { to: '/browse-resources', label: 'Browse Resources' },
    { to: '/categories', label: 'Categories' },
  ];

  const userLinks = [
    { to: '/browse-resources', label: 'Browse Resources' },
    // { to: '/add-resources', label: 'Add Resource' },
    // { to: '/write-tutorial', label: 'Write Tutorial' },
    { to: '/features', label: 'Features' },
    { to: '/bookmarks', label: 'Bookmarks' },
    { to: '/categories', label: 'Categories' },
    // { to: '/feature-suggestions', label: 'Feature Suggestions' },
    // { to: '/all-doc-improvements', label: 'Doc Improvements' },
    { to: '/discussions', label: 'Discussions' },
  ];

  const links = isLoggedIn ? userLinks : guestLinks;

  const userInitial = userName ? userName.charAt(0).toUpperCase() : (userEmail ? userEmail.charAt(0).toUpperCase() : 'U');

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg border border-gray-600/30 hover:shadow-xl transition-shadow duration-200 animate-pulse">
                <span className="text-white font-bold text-lg">DV</span>
              </div>
              <Link to="/" className="ml-2 text-xl font-bold text-white hover:text-blue-200 transition-colors duration-200">
                DevVault
              </Link>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources, tutorials, tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800/50"
              >
                {link.label}
              </Link>
            ))}

            {/* Contribute Dropdown */}
            {isLoggedIn && (
              <div className="relative" ref={contributionMenuRef}>
                <button
                  onMouseEnter={() => setShowContributionMenu(true)}
                  onMouseLeave={() => setShowContributionMenu(false)}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800/50 flex items-center"
                >
                  Contribute
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Contribution Dropdown Menu */}
                {showContributionMenu && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-200 backdrop-blur-sm"
                    onMouseEnter={() => setShowContributionMenu(true)}
                    onMouseLeave={() => setShowContributionMenu(false)}
                  >
                    <Link
                      to="/all-issues"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="text-lg mr-3"></span>
                      Report Issues
                    </Link>
                    <Link
                      to="/feature-suggestions"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="text-lg mr-3"></span>
                      Suggest Features
                    </Link>
                    <Link
                      to="/write-tutorial"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="text-lg mr-3"></span>
                      Write Tutorials
                    </Link>
                    <Link
                      to="/all-doc-improvements"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="text-lg mr-3"></span>
                      Improve Documentation
                    </Link>
                    <Link
                      to="/contribute"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="text-lg mr-3"></span>
                      Community Moderation
                    </Link>
                  </div>
                )}
              </div>
            )}

            {!isLoggedIn ? (
              <div className="flex items-center space-x-3 ml-6">
                <Link
                  to="/signin"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800/50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="relative ml-6" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg hover:shadow-xl transform hover:scale-105"
                  title={userEmail}
                >
                  {userInitial}
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-200 backdrop-blur-sm">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                      <p className="font-semibold truncate">{userEmail}</p>
                      <p className="text-xs text-gray-500 mt-1">Welcome back!</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Search Icon for Mobile */}
            <button
              onClick={() => navigate('/search')}
              className="text-gray-300 hover:text-white p-2"
            >
              🔍
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isOpen && (
          <div className="md:hidden pb-3 border-t border-gray-700 pt-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  🔍
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-700 pt-4 pb-3">
            <div className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Contribute Section */}
              {isLoggedIn && (
                <>
                  <div className="px-3 py-2 text-gray-400 text-sm font-semibold uppercase tracking-wider">
                    Contribute
                  </div>
                  <Link
                    to="/report-issues"
                    className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    🐛 Report Issues
                  </Link>
                  <Link
                    to="/suggest-features"
                    className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    💡 Suggest Features
                  </Link>
                  <Link
                    to="/write-tutorial"
                    className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    📝 Write Tutorials
                  </Link>
                  <Link
                    to="/improve-docs"
                    className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    📚 Improve Documentation
                  </Link>
                  <Link
                    to="/contribute"
                    className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    🤝 Community Moderation
                  </Link>
                </>
              )}

              {!isLoggedIn ? (
                <>
                  <Link
                    to="/signin"
                    className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-md text-base font-medium text-center hover:from-blue-600 hover:to-purple-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    👤 Your Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium"
                  >
                    🚪 Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;