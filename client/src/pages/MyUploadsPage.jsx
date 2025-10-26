import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { resourcesAPI, tutorialsAPI } from '../api/apiService';

const MyUploadsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resources');
  const [resources, setResources] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's resources and tutorials on component mount
  useEffect(() => {
    const fetchUserUploads = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [resourcesResponse, tutorialsResponse] = await Promise.all([
          resourcesAPI.getUserResources(),
          tutorialsAPI.getUserTutorials()
        ]);

        setResources(resourcesResponse.data || []);
        setTutorials(tutorialsResponse.tutorials || []);
      } catch (err) {
        setError('Unable to load your uploads. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserUploads();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'published': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <button
                onClick={() => navigate('/browse-resources')}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Browse Resources
              </button>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              My Uploads
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Manage and track the resources and tutorials you've contributed to the community.
            </p>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'resources'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Resources ({resources.length})
                </button>
                <button
                  onClick={() => setActiveTab('tutorials')}
                  className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'tutorials'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tutorials ({tutorials.length})
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
              <div className="flex items-center space-x-2 text-red-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <>
              {resources.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                  <div className="text-gray-300 text-6xl mb-4">
                    📚
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                    No resources uploaded yet
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Start contributing by adding helpful resources to the community.
                  </p>
                  <a
                    href="/add-resources"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add Your First Resource
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {resources.map((resource) => (
                    <div
                      key={resource._id}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-6">
                        {/* Resource Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">📄</span>
                              <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                                {resource.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Uploaded on: {formatDate(resource.createdAt)}</span>
                              <span className="capitalize">{resource.category}</span>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(resource.status)}`}>
                            {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                          </span>
                        </div>

                        {/* Resource Description */}
                        <div className="mb-4">
                          <p className="text-gray-700 line-clamp-2">{resource.description}</p>
                        </div>

                        {/* Resource Link */}
                        <div className="mb-4">
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 underline break-all"
                          >
                            {resource.link}
                          </a>
                        </div>

                        {/* Resource Stats */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Upvotes:</span>
                            <span>{resource.upvotes || 0}</span>
                          </div>
                          {resource.tags && resource.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Tags:</span>
                              <span>{resource.tags.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {/* Status Info */}
                        {resource.status === 'pending' && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-700">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">Under Review</span>
                            </div>
                            <p className="text-sm text-yellow-600 mt-1">
                              Your resource is being reviewed by our administrators. Once approved, it will be visible to all users.
                            </p>
                          </div>
                        )}

                        {resource.status === 'approved' && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">Approved</span>
                            </div>
                            <p className="text-sm text-green-600 mt-1">
                              Your resource is now live and visible to all users on the platform.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Tutorials Tab */}
          {activeTab === 'tutorials' && (
            <>
              {tutorials.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                  <div className="text-gray-300 text-6xl mb-4">
                    📝
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                    No tutorials written yet
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Share your knowledge by writing helpful tutorials for the community.
                  </p>
                  <a
                    href="/write-tutorial"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Write Your First Tutorial
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {tutorials.map((tutorial) => (
                    <div
                      key={tutorial._id}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-6">
                        {/* Tutorial Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">📖</span>
                              <h3
                                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                                onClick={() => navigate(`/tutorial/${tutorial._id}`)}
                              >
                                {tutorial.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Published on: {formatDate(tutorial.createdAt)}</span>
                              <span className="capitalize">{tutorial.category}</span>
                              <span className="capitalize">{tutorial.difficulty}</span>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tutorial.status)}`}>
                            {tutorial.status.charAt(0).toUpperCase() + tutorial.status.slice(1)}
                          </span>
                        </div>

                        {/* Tutorial Description */}
                        <div className="mb-4">
                          <p className="text-gray-700 line-clamp-2">{tutorial.description}</p>
                        </div>

                        {/* Tutorial Stats */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Views:</span>
                            <span>{tutorial.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Likes:</span>
                            <span>{tutorial.likes?.length || 0}</span>
                          </div>
                          {tutorial.estimatedTime && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Time:</span>
                              <span>{tutorial.estimatedTime} min</span>
                            </div>
                          )}
                          {tutorial.tags && tutorial.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Tags:</span>
                              <span>{tutorial.tags.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {/* Status Info */}
                        {tutorial.status === 'published' && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium">Published</span>
                            </div>
                            <p className="text-sm text-green-600 mt-1">
                              Your tutorial is live and available for all users to read and learn from.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyUploadsPage;
