import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { contentReportsAPI } from '../api/apiService';

const ContentReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

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
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await contentReportsAPI.getById(id);
      setReport(data.contentReport);
    } catch (err) {
      console.error('Failed to fetch report:', err);
      setMessage('Failed to load report details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    setMessage('');
    try {
      const data = await contentReportsAPI.updateStatus(id, { status: newStatus });
      setReport(data.contentReport);
      setMessage(`Report status updated to ${newStatus}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Report not found</h3>
          <p className="text-gray-600 mb-6">The report you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/all-content-reports')}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
          >
            Back to Reports
          </button>
        </div>
        <Footer />
      </div>
    );
  }

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
              Content Report <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-orange-300">Details</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              Review and manage this content report.
            </p>
            <button
              onClick={() => navigate('/all-content-reports')}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Reports
            </button>
          </div>
        </div>
      </section>

      {/* Report Details */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-8">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </div>

              {/* Status Update Buttons */}
              <div className="flex gap-2">
                {report.status !== 'pending' && (
                  <button
                    onClick={() => updateStatus('pending')}
                    disabled={updating}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                  >
                    Mark Pending
                  </button>
                )}
                {report.status !== 'reviewed' && (
                  <button
                    onClick={() => updateStatus('reviewed')}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                  >
                    Mark Reviewed
                  </button>
                )}
                {report.status !== 'resolved' && (
                  <button
                    onClick={() => updateStatus('resolved')}
                    disabled={updating}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>

            {/* Report Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Content Type */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Type</h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {contentTypes.find(type => type.value === report.contentType)?.icon || '❓'}
                  </span>
                  <span className="text-gray-700">
                    {contentTypes.find(type => type.value === report.contentType)?.label || report.contentType}
                  </span>
                </div>
              </div>

              {/* Report Reason */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Report Reason</h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {reportReasons.find(reason => reason.value === report.reportReason)?.icon || '📝'}
                  </span>
                  <span className="text-gray-700">
                    {reportReasons.find(reason => reason.value === report.reportReason)?.label || report.reportReason}
                  </span>
                </div>
              </div>
            </div>

            {/* Content URL */}
            {report.contentUrl && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Content URL</h3>
                <a
                  href={report.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {report.contentUrl}
                </a>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>
              </div>
            </div>

            {/* Contact Email */}
            {report.contactEmail && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Email</h3>
                <a
                  href={`mailto:${report.contactEmail}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {report.contactEmail}
                </a>
              </div>
            )}

            {/* Reporter Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Reporter Information</h3>
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">
                  {report.createdBy?.name || report.createdByName || 'Anonymous'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submitted on {new Date(report.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Success/Error Message */}
            {message && (
              <div className={`mt-6 p-4 rounded-lg text-center ${
                message.includes('successfully') || message.includes('updated')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContentReportDetailPage;
