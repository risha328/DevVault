import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { featureSuggestionsAPI } from '../api/apiService';

const FeatureSuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { value: 'ui-ux', label: 'UI/UX Improvements', icon: '🎨' },
    { value: 'functionality', label: 'New Functionality', icon: '⚙️' },
    { value: 'performance', label: 'Performance', icon: '⚡' },
    { value: 'mobile', label: 'Mobile Experience', icon: '📱' },
    { value: 'integration', label: 'Integrations', icon: '🔗' },
    { value: 'content', label: 'Content Management', icon: '📝' },
    { value: 'social', label: 'Social Features', icon: '👥' },
    { value: 'other', label: 'Other', icon: '💡' }
  ];

  const priorities = {
    low: { label: 'Nice to Have', color: 'bg-blue-100 text-blue-800' },
    medium: { label: 'Should Have', color: 'bg-green-100 text-green-800' },
    high: { label: 'Must Have', color: 'bg-orange-100 text-orange-800' },
    'game-changer': { label: 'Game Changer', color: 'bg-purple-100 text-purple-800' }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const data = await featureSuggestionsAPI.getAll();
      setSuggestions(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesStatus = filter === 'all' || suggestion.status === filter;
    const matchesCategory = categoryFilter === 'all' || suggestion.category === categoryFilter;
    const matchesSearch = searchQuery === '' ||
      suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.useCase.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.icon : '💡';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchSuggestions}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Feature <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-blue-300">Suggestions</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              Explore innovative ideas from our community. See what features users are requesting and help shape DevVault's future.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {suggestions.length} Total Suggestions
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Community-Driven
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Transparent Process
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search suggestions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>

              {/* Suggest New Feature Button */}
              <Link
                to="/suggest-features"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Suggest New Feature
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Suggestions List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredSuggestions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No suggestions found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or be the first to suggest a feature!</p>
              <Link
                to="/suggest-features"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Suggest a Feature
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuggestions.map((suggestion) => (
                <Link key={suggestion._id} to={`/feature-suggestions/${suggestion._id}`} className="block">
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(suggestion.category)}</span>
                        <div>
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColors[suggestion.status]}`}>
                            {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${priorities[suggestion.priority]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {priorities[suggestion.priority]?.label || suggestion.priority}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {suggestion.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {suggestion.description}
                    </p>

                    {/* Use Case */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Problem Solved:</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{suggestion.useCase}</p>
                    </div>

                    {/* Benefits */}
                    {suggestion.benefits && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Benefits:</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{suggestion.benefits}</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span>
                        {new Date(suggestion.createdAt).toLocaleDateString()}
                      </span>
                      {suggestion.createdBy && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          User
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeatureSuggestionsPage;
