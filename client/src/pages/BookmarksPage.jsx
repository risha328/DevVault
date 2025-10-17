import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookmarksPage = () => {
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  // Fetch user bookmarks on component mount
  useEffect(() => {
    const fetchBookmarks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5300/api/bookmark/user/bookmarks', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setBookmarkedItems(data.data);
        } else {
          setMessage('Failed to load bookmarks');
        }
      } catch (error) {
        setMessage('Error loading bookmarks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [navigate]);

  // Filter and sort bookmarks
  const filteredAndSortedBookmarks = bookmarkedItems
    .filter(item => {
      if (filter === 'all') return true;
      return item.type === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt);
        case 'oldest':
          return new Date(a.bookmarkedAt) - new Date(b.bookmarkedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Web Development': 'bg-blue-50 text-blue-700 border-blue-200',
      'Mobile Development': 'bg-green-50 text-green-700 border-green-200',
      'Data Science': 'bg-purple-50 text-purple-700 border-purple-200',
      'Machine Learning': 'bg-orange-50 text-orange-700 border-orange-200',
      'DevOps': 'bg-red-50 text-red-700 border-red-200',
      'Cloud Computing': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Cybersecurity': 'bg-gray-50 text-gray-700 border-gray-200',
      'Blockchain': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Game Development': 'bg-pink-50 text-pink-700 border-pink-200',
      'AI': 'bg-teal-50 text-teal-700 border-teal-200'
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getTypeIcon = (type) => {
    return type === 'tutorial' ? '📚' : '🔗';
  };

  const getTypeColor = (type) => {
    return type === 'tutorial' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const handleBookmark = async (itemId, itemType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to manage bookmarks');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5300/api/bookmark/${itemType}/${itemId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setBookmarkedItems(prev => prev.filter(item => item._id !== itemId));
        setMessage('Bookmark removed successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to remove bookmark');
      }
    } catch (error) {
      setMessage('Error removing bookmark');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-700">Loading your bookmarks...</h3>
              <p className="text-gray-500 mt-2">Please wait while we fetch your saved resources</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-lg mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              My Bookmarks
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your personal collection of saved resources and tutorials
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{bookmarkedItems.length} saved items</span>
            </div>
          </div>

          {/* Filters and Controls */}
          {bookmarkedItems.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                <div className="flex flex-wrap gap-4">
                  {/* Filter by Type */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">Filter:</span>
                    <select 
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Items</option>
                      <option value="tutorial">Tutorials</option>
                      <option value="resource">Resources</option>
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">Sort by:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Title A-Z</option>
                    </select>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {filteredAndSortedBookmarks.length} of {bookmarkedItems.length} items
                </div>
              </div>
            </div>
          )}

          {/* Items Grid */}
          {filteredAndSortedBookmarks.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">No bookmarks yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start exploring our extensive collection of resources and tutorials. Save your favorites to access them quickly later.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/browse-resources')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Browse Resources
                </button>
                <button
                  onClick={() => navigate('/tutorials')}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                >
                  Explore Tutorials
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedBookmarks.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  {/* Header with Type and Actions */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(item.type)}`}>
                        <span className="mr-1">{getTypeIcon(item.type)}</span>
                        {item.type === 'tutorial' ? 'Tutorial' : 'Resource'}
                      </span>
                      <button
                        onClick={() => handleBookmark(item._id, item.type)}
                        className="p-2 rounded-xl transition-all duration-200 text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100 hover:scale-110"
                        title="Remove bookmark"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                        </svg>
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {item.description || 'No description provided'}
                    </p>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Category and Difficulty */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      {item.difficulty && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 4).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-50 text-gray-600 px-2 py-1 rounded-lg text-xs border border-gray-200"
                            >
                              #{tag}
                            </span>
                          ))}
                          {item.tags.length > 4 && (
                            <span className="text-gray-400 text-xs px-2 py-1">
                              +{item.tags.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      {item.type === 'tutorial' ? (
                        <button
                          onClick={() => navigate(`/tutorial/${item._id}`)}
                          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold transition-all duration-200 hover:gap-3 group"
                        >
                          <span>Read Tutorial</span>
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      ) : (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-all duration-200 hover:gap-3 group"
                        >
                          <span>Visit Resource</span>
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {item.author?.name?.charAt(0) || item.createdByName?.charAt(0) || 'A'}
                        </div>
                        <span>{item.author?.name || item.createdByName || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9z"/>
                        </svg>
                        <span>Saved {formatDate(item.bookmarkedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Success/Error Message */}
          {message && (
            <div className="fixed bottom-6 right-6 max-w-sm">
              <div className={`p-4 rounded-xl shadow-lg border ${
                message.includes('successfully') 
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  {message.includes('successfully') ? (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-medium">{message}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookmarksPage;