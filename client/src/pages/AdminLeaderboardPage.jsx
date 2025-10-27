import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { adminAPI } from '../api/apiService';

const AdminLeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('totalContributions');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await adminAPI.getLeaderboard();
        setLeaderboard(response.leaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 shadow-gray-200';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-500 shadow-orange-200';
      // case 4:
      //   return 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-blue-200';
      // case 5:
      //   return 'bg-gradient-to-r from-green-400 to-green-500 shadow-green-200';
      // case 6:
      //   return 'bg-gradient-to-r from-purple-400 to-purple-500 shadow-purple-200';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-blue-200';
    }
  };

  const getFilterLabel = (filter) => {
    const labels = {
      totalContributions: 'Total Contributions',
      resources: 'Resources Shared',
      tutorials: 'Tutorials Created',
      discussions: 'Discussions Started'
    };
    return labels[filter] || filter;
  };

  const filteredAndSortedLeaderboard = leaderboard
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (activeFilter === 'totalContributions') {
        return b.stats.totalContributions - a.stats.totalContributions;
      } else if (activeFilter === 'resources') {
        return b.stats.resources - a.stats.resources;
      } else if (activeFilter === 'tutorials') {
        return b.stats.tutorials - a.stats.tutorials;
      } else if (activeFilter === 'discussions') {
        return b.stats.discussions - a.stats.discussions;
      }
      return 0;
    });

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium">Loading leaderboard...</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Contributor Leaderboard</h1>
                <p className="text-gray-600 text-lg">
                  Track and analyze community contributions across all metrics
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search contributors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Contributors</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{leaderboard.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">👥</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Contributions</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatNumber(leaderboard.reduce((sum, user) => sum + user.stats.totalContributions, 0))}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">📈</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resources Shared</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatNumber(leaderboard.reduce((sum, user) => sum + user.stats.resources, 0))}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">📚</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active This Month</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {leaderboard.filter(user => {
                        const monthAgo = new Date();
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return new Date(user.lastActive || user.createdAt) > monthAgo;
                      }).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">🔥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filter by Contribution Type</h2>
              <div className="text-sm text-gray-500">
                Showing {filteredAndSortedLeaderboard.length} of {leaderboard.length} contributors
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {['totalContributions', 'resources', 'tutorials', 'discussions'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {getFilterLabel(filter)}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {filteredAndSortedLeaderboard.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl text-gray-400">🏆</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Contributors Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm ? 'No contributors match your search criteria.' : 'No users have made contributions yet.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</div>
                  <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contributor</div>
                  <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</div>
                  <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Level</div>
                  <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Contributions</div>
                </div>

                {/* Leaderboard Items */}
                {filteredAndSortedLeaderboard.map((user, index) => {
                  const rank = index + 1;
                  const level = Math.floor(user.stats.totalContributions / 10) + 1;
                  
                  return (
                    <div
                      key={user._id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-6 hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* Rank - Mobile & Desktop */}
                      <div className="md:col-span-1 flex items-center">
                        <div className={`w-10 h-10 ${getRankColor(rank)} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                          {getRankIcon(rank)}
                        </div>
                      </div>

                      {/* User Info - Mobile & Desktop */}
                      <div className="md:col-span-4 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {user.name}
                            {user.role === 'admin' && (
                              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Admin</span>
                            )}
                          </h3>
                          <p className="text-gray-600 text-sm truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* User Details - Mobile & Desktop */}
                      <div className="md:col-span-3 flex items-center">
                        <div className="flex flex-col space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Role:</span>
                            <span className="font-medium capitalize">{user.role}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Joined:</span>
                            <span className="font-medium">
                              {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Level - Mobile & Desktop */}
                      <div className="md:col-span-2 flex items-center justify-start md:justify-center">
                        <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-full">
                          <span className="text-sm font-medium text-gray-700">Level {level}</span>
                        </div>
                      </div>

                      {/* Contributions - Mobile & Desktop */}
                      <div className="md:col-span-2 flex items-center justify-between md:justify-end md:space-x-4">
                        <div className="md:hidden text-sm font-medium text-gray-500">
                          {getFilterLabel(activeFilter)}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {formatNumber(user.stats[activeFilter] || user.stats.totalContributions)}
                          </div>
                          <div className="text-sm text-gray-500 hidden md:block">
                            {getFilterLabel(activeFilter)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLeaderboardPage;