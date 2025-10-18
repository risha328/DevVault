import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { contentReportsAPI } from '../api/apiService';

const AllContentReportsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, reviewed, resolved
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const contentTypes = [
    { value: 'resource', label: 'Resource', icon: '📚' },
    { value: 'comment', label: 'Comment', icon: '💬' },
    { value: 'user-profile', label: 'User Profile', icon: '👤' },
    { value: 'other', label: 'Other Content', icon: '❓' }
  ];

  const reportReasons = [
    { value: 'spam', label: 'Spam', icon: '🚫' },
    { value: 'inappropriate', label: 'Inappropriate', icon: '⚠️' },
    { value: 'misleading', label: 'Misleading', icon: '❌' },
    { value: 'copyright', label: 'Copyright', icon: '©️' },
    { value: 'harassment', label: 'Harassment', icon: '🛡️' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await contentReportsAPI.getAll();
      setReports(data.contentReports || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              All Content <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-orange-300">Reports</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              View all content reports submitted by the community.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-orange-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Community Moderation
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Safe Environment
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quick Resolution
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
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>

              {/* Content Type Filter */}
              <select
                value={contentTypeFilter}
                onChange={(e) => setContentTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {contentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Reports List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or be the first to submit a report!</p>
              <button
                onClick={() => navigate('/report-content')}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
              >
                Submit a Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports
                .filter(report => {
                  const matchesStatus = filter === 'all' || report.status === filter;
                  const matchesContentType = contentTypeFilter === 'all' || report.contentType === contentTypeFilter;
                  const matchesSearch = searchQuery === '' ||
                    report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    report.contentUrl?.toLowerCase().includes(searchQuery.toLowerCase());

                  return matchesStatus && matchesContentType && matchesSearch;
                })
                .map((report) => (
                  <div
                    key={report._id}
                    onClick={() => navigate(`/content-reports/${report._id}`)}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {contentTypes.find(type => type.value === report.contentType)?.icon || '❓'}
                        </span>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    {/* Content Type and URL */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Content Type:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {contentTypes.find(type => type.value === report.contentType)?.label || report.contentType}
                      </p>
                      {report.contentUrl && (
                        <p className="text-sm text-gray-600 mt-1 truncate">{report.contentUrl}</p>
                      )}
                    </div>

                    {/* Report Reason */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Report Reason:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {reportReasons.find(reason => reason.value === report.reportReason)?.label || report.reportReason}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Description:</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{report.description}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      {(report.createdBy || report.createdByName) && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          {report.createdBy?.name || report.createdByName || 'Anonymous'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllContentReportsPage;
