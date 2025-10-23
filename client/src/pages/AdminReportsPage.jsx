import { useState, useEffect } from 'react';
import { issuesAPI } from '../api/apiService';
import AdminLayout from '../components/admin/AdminLayout';

const AdminReportsPage = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, approved, pending
  const [searchTerm, setSearchTerm] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isApproving, setIsApproving] = useState(false);

  // Fetch issues on component mount
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await issuesAPI.getAll();
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

  // Filter issues based on approval status and search term
  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === 'all' ||
                         (filter === 'approved' && issue.approved) ||
                         (filter === 'pending' && !issue.approved);
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApproveClick = (issue) => {
    setSelectedIssue(issue);
    setShowApproveModal(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedIssue) return;

    try {
      setIsApproving(true);
      await issuesAPI.approve(selectedIssue._id);
      // Update the local state
      setIssues(issues.map(issue =>
        issue._id === selectedIssue._id
          ? { ...issue, approved: true, approvedAt: new Date() }
          : issue
      ));
      setShowApproveModal(false);
      setSelectedIssue(null);
    } catch (err) {
      setError('Failed to approve issue. Please try again.');
      console.error('Approve error:', err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleApproveCancel = () => {
    setShowApproveModal(false);
    setSelectedIssue(null);
  };

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
    <AdminLayout>
      <div className="space-y-6">
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
    </AdminLayout>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Reports Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Review and approve reported issues. Approved issues will be visible to users on the website.
          </p>

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

            {/* Approval Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'approved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === status
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {status === 'all' ? 'All Issues' : status.charAt(0).toUpperCase() + status.slice(1)}
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
                          <h3 className="text-xl font-bold text-gray-900">
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
                        {issue.approved && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Approved
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Issue Description */}
                    <div className="mb-4">
                      <p className="text-gray-700 line-clamp-3">{issue.description}</p>
                    </div>

                    {/* Issue Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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

                    {/* Approval Section */}
                    {!issue.approved && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleApproveClick(issue)}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                        >
                          Approve Issue
                        </button>
                      </div>
                    )}

                    {issue.approved && issue.approvedAt && (
                      <div className="text-sm text-gray-600">
                        Approved on: {formatDate(issue.approvedAt)}
                      </div>
                    )}

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

        {/* Approval Confirmation Modal */}
        {showApproveModal && selectedIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Approve Issue
                  </h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Are you sure you want to approve this issue? Once approved, it will be visible to all users on the website.
                </p>
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900">{selectedIssue.title}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{selectedIssue.description}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleApproveCancel}
                  disabled={isApproving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveConfirm}
                  disabled={isApproving}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
                >
                  {isApproving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Approving...
                    </>
                  ) : (
                    'Yes, Approve'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
