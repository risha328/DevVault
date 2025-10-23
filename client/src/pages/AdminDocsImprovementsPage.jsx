import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { docImprovementsAPI } from '../api/apiService';

const AdminDocsImprovementsPage = () => {
  const [improvements, setImprovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [docTypeFilter, setDocTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedImprovement, setSelectedImprovement] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const docTypes = [
    { value: 'readme', label: 'README Files', icon: '📖' },
    { value: 'api-docs', label: 'API Documentation', icon: '🔌' },
    { value: 'user-guides', label: 'User Guides', icon: '👤' },
    { value: 'faq', label: 'FAQ Section', icon: '❓' },
    { value: 'troubleshooting', label: 'Troubleshooting', icon: '🔧' },
    { value: 'other', label: 'Other Documentation', icon: '📄' }
  ];

  const issueTypes = [
    { value: 'outdated', label: 'Outdated Information', icon: '⏰' },
    { value: 'missing', label: 'Missing Information', icon: '🔍' },
    { value: 'unclear', label: 'Unclear Instructions', icon: '💭' },
    { value: 'formatting', label: 'Formatting Issues', icon: '🎨' },
    { value: 'broken-links', label: 'Broken Links', icon: '🔗' },
    { value: 'typos', label: 'Typos & Grammar', icon: '✏️' }
  ];

  // Fetch improvements on component mount
  useEffect(() => {
    const fetchImprovements = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await docImprovementsAPI.getAll();
        setImprovements(response.data || []);
      } catch (err) {
        setError('Unable to load documentation improvements. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImprovements();
  }, []);

  // Filter improvements based on status, doc type and search term
  const filteredImprovements = improvements.filter(improvement => {
    const matchesFilter = filter === 'all' || improvement.status === filter;
    const matchesDocType = docTypeFilter === 'all' || improvement.docType === docTypeFilter;
    const matchesSearch = searchTerm === '' ||
      improvement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      improvement.suggestedFix?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      improvement.specificPage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      improvement.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      improvement.createdBy?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesDocType && matchesSearch;
  });

  const handleApproveClick = (improvement) => {
    setSelectedImprovement(improvement);
    setShowApproveModal(true);
  };

  const handleRejectClick = (improvement) => {
    setSelectedImprovement(improvement);
    setShowRejectModal(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedImprovement) return;

    try {
      setIsProcessing(true);
      await docImprovementsAPI.updateStatus(selectedImprovement._id, 'approved');
      // Update the local state
      setImprovements(improvements.map(improvement =>
        improvement._id === selectedImprovement._id
          ? { ...improvement, status: 'approved', approvedAt: new Date() }
          : improvement
      ));
      setShowApproveModal(false);
      setSelectedImprovement(null);
    } catch (err) {
      setError('Failed to approve documentation improvement. Please try again.');
      console.error('Approve error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedImprovement) return;

    try {
      setIsProcessing(true);
      await docImprovementsAPI.updateStatus(selectedImprovement._id, 'rejected');
      // Update the local state
      setImprovements(improvements.map(improvement =>
        improvement._id === selectedImprovement._id
          ? { ...improvement, status: 'rejected', rejectedAt: new Date() }
          : improvement
      ));
      setShowRejectModal(false);
      setSelectedImprovement(null);
    } catch (err) {
      setError('Failed to reject documentation improvement. Please try again.');
      console.error('Reject error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveCancel = () => {
    setShowApproveModal(false);
    setSelectedImprovement(null);
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setSelectedImprovement(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocTypeIcon = (docType) => {
    const type = docTypes.find(t => t.value === docType);
    return type ? type.icon : '📄';
  };

  const getIssueTypeLabel = (issueType) => {
    const issue = issueTypes.find(i => i.value === issueType);
    return issue ? issue.label : issueType;
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
            Documentation Improvements Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Review and manage documentation improvement suggestions from users. Approve suggestions to make them visible on the website.
          </p>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search improvements..."
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

            {/* Filters */}
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === status
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {status === 'all' ? 'All Improvements' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Doc Type Filter */}
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Doc Types</option>
              {docTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
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

        {/* Improvements List */}
        {filteredImprovements.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="text-gray-300 text-6xl mb-4">
              {searchTerm || filter !== 'all' || docTypeFilter !== 'all' ? '🔍' : '📝'}
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">
              {searchTerm || filter !== 'all' || docTypeFilter !== 'all' ? 'No matching improvements found' : 'No improvements submitted yet'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || filter !== 'all' || docTypeFilter !== 'all'
                ? 'Try adjusting your search terms or filter settings.'
                : 'Improvements will appear here once they are submitted by users.'
              }
            </p>
            {(searchTerm || filter !== 'all' || docTypeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                  setDocTypeFilter('all');
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
                Showing <span className="font-semibold">{filteredImprovements.length}</span> of{' '}
                <span className="font-semibold">{improvements.length}</span> improvements
              </p>
            </div>

            {/* Improvements Grid */}
            <div className="space-y-6">
              {filteredImprovements.map((improvement) => (
                <div
                  key={improvement._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Improvement Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getDocTypeIcon(improvement.docType)}</span>
                          <h3 className="text-xl font-bold text-gray-900">
                            {docTypes.find(type => type.value === improvement.docType)?.label || improvement.docType}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Submitted by: {improvement.createdBy?.name || improvement.createdBy?.email || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{formatDate(improvement.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(improvement.status)}`}>
                          {improvement.status.charAt(0).toUpperCase() + improvement.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Specific Page */}
                    {improvement.specificPage && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Specific Page:</h4>
                        <p className="text-gray-700">{improvement.specificPage}</p>
                      </div>
                    )}

                    {/* Issue Type */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Issue Type:</h4>
                      <p className="text-gray-700">{getIssueTypeLabel(improvement.issueType)}</p>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Description:</h4>
                      <p className="text-gray-700">{improvement.description}</p>
                    </div>

                    {/* Suggested Fix */}
                    {improvement.suggestedFix && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Suggested Fix:</h4>
                        <p className="text-gray-700">{improvement.suggestedFix}</p>
                      </div>
                    )}

                    {/* Contact Info */}
                    {improvement.contactEmail && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Contact:</h4>
                        <p className="text-gray-700">{improvement.contactEmail}</p>
                      </div>
                    )}

                    {/* Approval Section */}
                    {improvement.status === 'pending' && (
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleRejectClick(improvement)}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveClick(improvement)}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                        >
                          Approve
                        </button>
                      </div>
                    )}

                    {/* Approved/Rejected Info */}
                    {(improvement.status === 'approved' || improvement.status === 'rejected') && (
                      <div className="text-sm text-gray-600">
                        {improvement.status === 'approved' ? 'Approved' : 'Rejected'} on: {formatDate(improvement.approvedAt || improvement.rejectedAt)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Approve Confirmation Modal */}
        {showApproveModal && selectedImprovement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Approve Documentation Improvement
                  </h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Are you sure you want to approve this documentation improvement? Once approved, it will be visible to all users on the website.
                </p>
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900">{selectedImprovement.description}</p>
                  <p className="text-sm text-gray-600 mt-1">Type: {docTypes.find(type => type.value === selectedImprovement.docType)?.label}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleApproveCancel}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveConfirm}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
                >
                  {isProcessing ? (
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

        {/* Reject Confirmation Modal */}
        {showRejectModal && selectedImprovement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Reject Documentation Improvement
                  </h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Are you sure you want to reject this documentation improvement? This action cannot be undone.
                </p>
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900">{selectedImprovement.description}</p>
                  <p className="text-sm text-gray-600 mt-1">Type: {docTypes.find(type => type.value === selectedImprovement.docType)?.label}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleRejectCancel}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Rejecting...
                    </>
                  ) : (
                    'Yes, Reject'
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

export default AdminDocsImprovementsPage;
