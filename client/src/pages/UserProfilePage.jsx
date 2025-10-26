import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userAPI } from '../api/apiService';

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resources');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const [userData, resourcesData, tutorialsData] = await Promise.all([
          userAPI.getUserProfile(userId),
          userAPI.getUserResources(userId),
          userAPI.getUserTutorials(userId)
        ]);

        setUser(userData.user);
        setResources(resourcesData.data || []);
        setTutorials(tutorialsData.tutorials || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 rounded-full flex items-center justify-center">
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
        <div>
          
          {/* User Profile Header */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {getInitials(user.name)}
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-slate-800 mb-3">{user.name}</h1>
                <p className="text-slate-600 text-lg mb-6 max-w-2xl">{user.bio || 'No bio available'}</p>
                
                <div className="flex flex-wrap gap-6 text-slate-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-800">{resources.length}</span>
                      <span className="text-slate-600">Resources</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300"></div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-800">{tutorials.length}</span>
                      <span className="text-slate-600">Tutorials</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Tabs */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-slate-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`flex items-center gap-2 px-8 py-5 text-base font-semibold border-b-2 transition-all ${
                    activeTab === 'resources'
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resources
                  <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded-full text-sm font-medium min-w-8">
                    {resources.length}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('tutorials')}
                  className={`flex items-center gap-2 px-8 py-5 text-base font-semibold border-b-2 transition-all ${
                    activeTab === 'tutorials'
                      ? 'border-green-600 text-green-600 bg-green-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Tutorials
                  <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded-full text-sm font-medium min-w-8">
                    {tutorials.length}
                  </span>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'resources' ? (
                <div>
                  {resources.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl text-slate-400">📚</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-700 mb-3">No Resources Yet</h3>
                      <p className="text-slate-500 max-w-md mx-auto">
                        This user hasn't shared any learning resources yet. Check back later for updates.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {resources.map((resource) => (
                        <div
                          key={resource._id}
                          className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {resource.category || 'General'}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {resource.title}
                          </h3>
                          <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {resource.description}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <span className="text-xs text-slate-500 font-medium">
                              {new Date(resource.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
                            >
                              Visit Resource
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {tutorials.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl text-slate-400">📝</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-700 mb-3">No Tutorials Yet</h3>
                      <p className="text-slate-500 max-w-md mx-auto">
                        This user hasn't published any tutorials yet. Check back later for educational content.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tutorials.map((tutorial) => (
                        <div
                          key={tutorial._id}
                          className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-green-200 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {tutorial.difficulty || 'All Levels'}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-slate-800 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                            {tutorial.title}
                          </h3>
                          <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {tutorial.description}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <span className="text-xs text-slate-500 font-medium">
                              {new Date(tutorial.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <button
                              onClick={() => navigate(`/tutorial/${tutorial._id}`)}
                              className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-semibold transition-colors"
                            >
                              Read Tutorial
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;