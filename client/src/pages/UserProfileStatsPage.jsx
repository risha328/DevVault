import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userAPI } from '../api/apiService';

const UserProfileStatsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getUserStats(userId);
        setUser(response.user);
        setStats(response.stats);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [userId]);

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

  const calculateContributionPercentage = (count) => {
    if (!stats?.totalContributions || stats.totalContributions === 0) return 0;
    return Math.round((count / stats.totalContributions) * 100);
  };

  const statCategories = [
    {
      id: 'content',
      name: 'Content Creation',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'community',
      name: 'Community Engagement',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1a2 2 0 012-2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l4-4h4a2 2 0 002 2v1a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'quality',
      name: 'Quality Assurance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const statCards = [
    {
      id: 'resources',
      title: 'Resources Shared',
      count: stats?.resources || 0,
      icon: '📚',
      category: 'content',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconBgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Educational resources uploaded',
      trend: '+12% this month'
    },
    {
      id: 'tutorials',
      title: 'Tutorials Created',
      count: stats?.tutorials || 0,
      icon: '📝',
      category: 'content',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconBgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Learning tutorials published',
      trend: '+8% this month'
    },
    {
      id: 'discussions',
      title: 'Discussions Started',
      count: stats?.discussions || 0,
      icon: '💬',
      category: 'community',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconBgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Community discussions initiated',
      trend: '+15% this month'
    },
    {
      id: 'featureSuggestions',
      title: 'Feature Suggestions',
      count: stats?.featureSuggestions || 0,
      icon: '💡',
      category: 'community',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconBgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      description: 'Innovative ideas submitted',
      trend: '+5 implemented'
    },
    {
      id: 'issues',
      title: 'Issues Reported',
      count: stats?.issues || 0,
      icon: '🐛',
      category: 'quality',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconBgColor: 'bg-red-100',
      textColor: 'text-red-600',
      description: 'Bugs and issues identified',
      trend: '92% resolved'
    },
    {
      id: 'contentReports',
      title: 'Content Reports',
      count: stats?.contentReports || 0,
      icon: '🚨',
      category: 'quality',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconBgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      description: 'Content quality reports',
      trend: '100% reviewed'
    },
    {
      id: 'docImprovements',
      title: 'Documentation Edits',
      count: stats?.docImprovements || 0,
      icon: '📖',
      category: 'content',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconBgColor: 'bg-teal-100',
      textColor: 'text-teal-600',
      description: 'Documentation improvements',
      trend: '+25% this quarter'
    },
    {
      id: 'totalContributions',
      title: 'Total Contributions',
      count: stats?.totalContributions || 0,
      icon: '⭐',
      category: 'all',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconBgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Overall community impact',
      trend: 'Top 10% contributor'
    }
  ];

  const filteredStats = activeFilter === 'all' 
    ? statCards 
    : statCards.filter(stat => stat.category === activeFilter || stat.id === 'totalContributions');

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">Loading user statistics...</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 rounded-2xl flex items-center justify-center">
              <span className="text-3xl text-slate-400">👤</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">User Not Found</h2>
            <p className="text-slate-600 mb-8 text-lg">
              The user profile you're looking for doesn't exist or may have been removed.
            </p>
            <button
              onClick={() => navigate('/browse-resources')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              Browse Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* User Profile Header */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                  {getInitials(user.name)}
                </div>
                <div className="text-center lg:text-left">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md mb-2">
                    Level {Math.floor(stats.totalContributions / 10) + 1} Contributor
                  </div>
                  <div className="text-slate-500 text-sm">
                    Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl font-bold text-slate-800 mb-3">{user.name}</h1>
                <p className="text-slate-600 text-lg mb-6">{user.email}</p>
                
                {/* Contribution Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-slate-800 mb-1">{formatNumber(stats.totalContributions)}</div>
                    <div className="text-slate-600 text-sm">Total Contributions</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-slate-800 mb-1">{formatNumber(stats.resources + stats.tutorials)}</div>
                    <div className="text-slate-600 text-sm">Content Created</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-slate-800 mb-1">
                      {stats.totalContributions > 0 ? Math.round((stats.featureSuggestions / stats.totalContributions) * 100) : 0}%
                    </div>
                    <div className="text-slate-600 text-sm">Innovation Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Contribution Analytics</h2>
                <p className="text-slate-600 text-lg">
                  Detailed breakdown of {user.name}'s platform contributions
                </p>
              </div>
              
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Contributions
                </button>
                {statCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeFilter === category.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStats.map((stat, index) => (
                <div
                  key={stat.id}
                  className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.iconBgColor} rounded-xl flex items-center justify-center text-xl`}>
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                        {formatNumber(stat.count)}
                      </div>
                      <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {stat.trend}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                    {stat.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {stat.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Contribution Ratio</span>
                      <span>{calculateContributionPercentage(stat.count)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 bg-gradient-to-r ${stat.color} rounded-full transition-all duration-700 ease-out`}
                        style={{
                          width: `${calculateContributionPercentage(stat.count)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Impact Summary */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Community Impact Summary</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  {user.name} has made <span className="font-semibold text-blue-600">{formatNumber(stats.totalContributions)}</span> valuable contributions 
                  to our platform, demonstrating exceptional commitment to community growth and platform improvement.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="font-semibold text-blue-700 mb-1">Content Creation</div>
                    <div className="text-slate-600">{stats.resources + stats.tutorials} educational assets</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="font-semibold text-green-700 mb-1">Quality Assurance</div>
                    <div className="text-slate-600">{stats.issues + stats.contentReports} quality reports</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="font-semibold text-purple-700 mb-1">Community Growth</div>
                    <div className="text-slate-600">{stats.discussions + stats.featureSuggestions} engagements</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Section */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Continue Making an Impact</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Your contributions help build a better learning community. Keep sharing knowledge and improving the platform.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => navigate(`/user/${userId}`)}
                  className="bg-white text-slate-800 px-8 py-3 rounded-lg hover:bg-slate-100 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  View Full Profile
                </button>
                <button
                  onClick={() => navigate('/contribute')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg border border-blue-500"
                >
                  Make New Contribution
                </button>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="bg-transparent text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium border border-white/30"
                >
                  View Leaderboard
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfileStatsPage;