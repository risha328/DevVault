import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { bookmarksAPI } from '../api/apiService';

const AdminBookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const data = await bookmarksAPI.getAllBookmarks();
      setBookmarks(data.data || []);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesType = filter === 'all' || bookmark.itemType === filter;
    const matchesSearch = searchQuery === '' ||
      bookmark.itemTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const getItemTypeIcon = (type) => {
    return type === 'resource' ? '📚' : '📝';
  };

  const getItemTypeLabel = (type) => {
    return type === 'resource' ? 'Resource' : 'Tutorial';
  };

  const getItemTypeBadge = (type) => {
    const config = {
      resource: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Resource' },
      tutorial: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Tutorial' }
    };
    
    const { color, label } = config[type] || { color: 'bg-gray-100 text-gray-800 border-gray-200', label: type };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
        {label}
      </span>
    );
  };

  // Calculate stats
  const resourceBookmarks = bookmarks.filter(b => b.itemType === 'resource').length;
  const tutorialBookmarks = bookmarks.filter(b => b.itemType === 'tutorial').length;
  const uniqueUsers = new Set(bookmarks.map(b => b.user?._id)).size;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookmarks Management</h1>
            <p className="mt-1 text-sm text-gray-600">Monitor and manage all user bookmarks across the platform</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={fetchBookmarks}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">📚</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Resource Bookmarks</p>
                  <p className="text-2xl font-bold text-gray-900">{resourceBookmarks}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">📝</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Tutorial Bookmarks</p>
                  <p className="text-2xl font-bold text-gray-900">{tutorialBookmarks}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">Unique Users</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueUsers}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Bookmarks
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by item title, user name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="w-full lg:w-auto">
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full lg:w-48 py-2.5 px-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              >
                <option value="all">All Types</option>
                <option value="resource">Resources Only</option>
                <option value="tutorial">Tutorials Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookmarks Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Bookmarks ({filteredBookmarks.length})
              </h3>
              {!loading && (
                <div className="text-sm text-gray-500">
                  Showing {filteredBookmarks.length} of {bookmarks.length} total
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-3 text-sm text-gray-600">Loading bookmarks...</p>
              </div>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🔖</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {searchQuery || filter !== 'all'
                  ? 'No bookmarks match your current search or filters. Try adjusting your criteria.'
                  : 'No bookmarks have been created by users yet.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bookmarked Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Bookmarked
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookmarks.map((bookmark) => (
                    <tr key={bookmark._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{getItemTypeIcon(bookmark.itemType)}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {bookmark.itemTitle || 'Untitled'}
                            </div>
                            {bookmark.itemDescription && (
                              <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                                {bookmark.itemDescription}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700">
                              {bookmark.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {bookmark.user?.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {bookmark.user?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getItemTypeBadge(bookmark.itemType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(bookmark.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(bookmark.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!loading && bookmarks.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-lg font-medium text-blue-900">Bookmark Analytics</h4>
                <p className="text-blue-700 mt-1">
                  {resourceBookmarks} resources and {tutorialBookmarks} tutorials bookmarked by {uniqueUsers} users
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookmarksPage;