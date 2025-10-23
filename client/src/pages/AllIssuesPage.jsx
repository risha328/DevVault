import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { issuesAPI } from '../api/apiService';
import { Link } from 'react-router-dom';

const AllIssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch issues on component mount
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await issuesAPI.getApproved();
        setIssues(response.issues || response.data || []);
      } catch (err) {
        setError('Unable to load issues. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Filter issues based on status and search term
  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === 'all' || issue.status === filter;
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIssueTypeIcon = (type) => {
    switch (type) {
      case 'bug': return '🐛';
      case 'broken-link': return '🔗';
      case 'performance': return '⚡';
      case 'ui-ux': return '🎨';
      case 'accessibility': return '♿';
      case 'other': return '❓';
      default: return '📋';
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All Reported Issues
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              View and track all issues reported by the community. Help us improve DevVault by staying updated on bug fixes and feature requests.
            </p>

            {/* My Issues Button */}
            <div className="mb-8">
              <Link
                to="/my-issues"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg"
              >
                <span className="mr-2">📋</span>
                View My Issues
              </Link>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {['all', 'open', 'in-progress', 'resolved', 'closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      filter === status
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {status === 'all' ? 'All Issues' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </button>
                ))}
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

          {/* Issues List */}
          {filteredIssues.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="text-gray-300 text-6xl mb-4">
                {searchTerm || filter !== 'all' ? '🔍' : '📋'}
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                {searchTerm || filter !== 'all' ? 'No matching issues found' : 'No issues reported yet'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search terms or filter settings.'
                  : 'Issues will appear here once they are reported by users.'
                }
              </p>
              {(searchTerm || filter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="mt-4 px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredIssues.length}</span> of{' '}
                  <span className="font-semibold">{issues.length}</span> issues
                </p>
              </div>

              {/* Issues Grid */}
              <div className="space-y-6">
                {filteredIssues.map((issue) => (
                  <div
                    key={issue._id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      {/* Issue Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getIssueTypeIcon(issue.issueType)}</span>
                            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                              {issue.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Reported by: {issue.createdByName || 'Anonymous'}</span>
                            <span>•</span>
                            <span>{formatDate(issue.createdAt)}</span>
                            {issue.affectedPage && (
                              <>
                                <span>•</span>
                                <span className="text-blue-600">{issue.affectedPage}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(issue.status)}`}>
                            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace('-', ' ')}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(issue.severity)}`}>
                            {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Issue Description */}
                      <div className="mb-4">
                        <p className="text-gray-700 line-clamp-3">{issue.description}</p>
                      </div>

                      {/* Issue Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Type:</span>
                          <span className="capitalize">{issue.issueType.replace('-', ' ')}</span>
                        </div>
                        {issue.browserInfo && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Browser:</span>
                            <span>{issue.browserInfo}</span>
                          </div>
                        )}
                        {issue.contactEmail && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Contact:</span>
                            <span>{issue.contactEmail}</span>
                          </div>
                        )}
                      </div>

                      {/* Additional Details (Expandable) */}
                      {(issue.steps || issue.expectedBehavior || issue.actualBehavior) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <details className="group">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                              <svg className="w-4 h-4 transform group-open:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              View additional details
                            </summary>
                            <div className="mt-3 space-y-3 text-sm">
                              {issue.steps && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-1">Steps to Reproduce:</h4>
                                  <p className="text-gray-700 whitespace-pre-line">{issue.steps}</p>
                                </div>
                              )}
                              {issue.expectedBehavior && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-1">Expected Behavior:</h4>
                                  <p className="text-gray-700">{issue.expectedBehavior}</p>
                                </div>
                              )}
                              {issue.actualBehavior && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-1">Actual Behavior:</h4>
                                  <p className="text-gray-700">{issue.actualBehavior}</p>
                                </div>
                              )}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllIssuesPage;
