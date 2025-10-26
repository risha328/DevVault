import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userAPI } from '../api/apiService';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('totalContributions');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getLeaderboard();
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
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-slate-400 to-slate-600';
    }
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <section className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">🏆 Community Leaderboard</h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Celebrating our top contributors who make DevVault a better place for everyone.
            </p>
          </section>

          {/* Filter Buttons */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveFilter('totalContributions')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === 'totalContributions'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Total Contributions
              </button>
              <button
                onClick={() => setActiveFilter('resources')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === 'resources'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Resources Shared
              </button>
              <button
                onClick={() => setActiveFilter('tutorials')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === 'tutorials'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tutorials Created
              </button>
              <button
                onClick={() => setActiveFilter('discussions')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === 'discussions'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Discussions Started
              </button>
            </div>
          </section>

          {/* Leaderboard */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            {sortedLeaderboard.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl text-slate-400">🏆</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">No Contributors Yet</h3>
                <p className="text-slate-600 mb-8">
                  Be the first to make a contribution and claim the top spot!
                </p>
                <button
                  onClick={() => navigate('/contribute')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Start Contributing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedLeaderboard.map((user, index) => {
                  const rank = index + 1;
                  return (
                    <div
                      key={user._id}
                      className="flex items-center p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/user/${user._id}/stats`)}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 mr-6">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getRankColor(rank)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                          {getRankIcon(rank)}
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {getInitials(user.name)}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-slate-600 text-sm">{user.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>Level {Math.floor(user.stats.totalContributions / 10) + 1}</span>
                          <span>•</span>
                          <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-2xl font-bold text-slate-800 mb-1">
                          {formatNumber(user.stats[activeFilter] || user.stats.totalContributions)}
                        </div>
                        <div className="text-slate-600 text-sm">
                          {activeFilter === 'totalContributions' ? 'Total Contributions' :
                           activeFilter === 'resources' ? 'Resources' :
                           activeFilter === 'tutorials' ? 'Tutorials' : 'Discussions'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Call to Action */}
          <section className="text-center mt-12">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Climb the Ranks?</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Every contribution counts. Share knowledge, report issues, suggest features, and help build the community.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => navigate('/contribute')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Start Contributing
                </button>
                <button
                  onClick={() => navigate('/browse-resources')}
                  className="bg-transparent text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium border border-white/30"
                >
                  Explore Resources
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

export default LeaderboardPage;
