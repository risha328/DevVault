import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookmarksPage = () => {
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Web Development': 'bg-blue-100 text-blue-800',
      'Mobile Development': 'bg-green-100 text-green-800',
      'Data Science': 'bg-purple-100 text-purple-800',
      'Machine Learning': 'bg-orange-100 text-orange-800',
      'DevOps': 'bg-red-100 text-red-800',
      'Cloud Computing': 'bg-indigo-100 text-indigo-800',
      'Cybersecurity': 'bg-gray-100 text-gray-800',
      'Blockchain': 'bg-yellow-100 text-yellow-800',
      'Game Development': 'bg-pink-100 text-pink-800',
      'AI': 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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
        // Remove the item from the bookmarked items list
        setBookmarkedItems(prev => prev.filter(item => item._id !== itemId));
        setMessage(data.message);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Failed to remove bookmark');
      }
    } catch (error) {
      setMessage('Error removing bookmark');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              My Bookmarks
            </h1>
            <p className="text-gray-600">
              Your saved resources and tutorials
            </p>
          </div>

          {/* Items Grid */}
          {bookmarkedItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookmarks yet</h3>
              <p className="text-gray-500 mb-6">
                Start exploring resources and tutorials to save your favorites!
              </p>
              <button
                onClick={() => navigate('/browse-resources')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                Browse Resources
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    {/* Type Badge */}
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        item.type === 'tutorial' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.type === 'tutorial' ? '📝 Tutorial' : '🔗 Resource'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {item.description || 'No description provided'}
                    </p>

                    {/* Category */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-gray-400 text-xs">
                              +{item.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Link or Read More */}
                      {item.type === 'tutorial' ? (
                        <button
                          onClick={() => navigate(`/tutorial/${item._id}`)}
                          className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Read Tutorial
                        </button>
                      ) : (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Visit Resource
                        </a>
                      )}

                      {/* Remove Bookmark Button */}
                      <button
                        onClick={() => handleBookmark(item._id, item.type)}
                        className="p-2 rounded-full transition-colors duration-200 text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                        title="Remove bookmark"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span>By {item.author?.name || item.createdByName || 'Anonymous'}</span>
                      <span>Bookmarked {formatDate(item.bookmarkedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="mt-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center">
              {message}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookmarksPage;
