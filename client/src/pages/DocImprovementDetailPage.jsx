import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { docImprovementsAPI } from '../api/apiService';

const DocImprovementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [improvement, setImprovement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const docTypes = [
    { value: 'readme', label: 'README Files', icon: '📖', description: 'Project READMEs and setup instructions' },
    { value: 'api-docs', label: 'API Documentation', icon: '🔌', description: 'API endpoints and usage guides' },
    { value: 'user-guides', label: 'User Guides', icon: '👤', description: 'How-to guides and tutorials' },
    { value: 'faq', label: 'FAQ Section', icon: '❓', description: 'Frequently asked questions' },
    { value: 'troubleshooting', label: 'Troubleshooting', icon: '🔧', description: 'Common issues and solutions' },
    { value: 'other', label: 'Other Documentation', icon: '📄', description: 'Other documentation types' }
  ];

  const issueTypes = [
    { value: 'outdated', label: 'Outdated Information', icon: '⏰', description: 'Information no longer accurate' },
    { value: 'missing', label: 'Missing Information', icon: '🔍', description: 'Important details are missing' },
    { value: 'unclear', label: 'Unclear Instructions', icon: '💭', description: 'Instructions are confusing' },
    { value: 'formatting', label: 'Formatting Issues', icon: '🎨', description: 'Poor formatting or layout' },
    { value: 'broken-links', label: 'Broken Links', icon: '🔗', description: 'Links that don\'t work' },
    { value: 'typos', label: 'Typos & Grammar', icon: '✏️', description: 'Spelling or grammar errors' }
  ];

  useEffect(() => {
    fetchImprovement();
  }, [id]);

  const fetchImprovement = async () => {
    try {
      const data = await docImprovementsAPI.getById(id);
      setImprovement(data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch improvement details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !improvement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Improvement</h1>
            <p className="text-gray-600 mb-6">{error || 'Improvement not found'}</p>
            <button
              onClick={() => navigate('/all-doc-improvements')}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200"
            >
              Back to All Improvements
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Documentation <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">Improvement</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              Detailed view of the improvement suggestion
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <span className="text-4xl">
                  {docTypes.find(type => type.value === improvement.docType)?.icon || '📄'}
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {docTypes.find(type => type.value === improvement.docType)?.label || improvement.docType}
                  </h1>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                    improvement.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    improvement.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {improvement.status.charAt(0).toUpperCase() + improvement.status.slice(1)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/all-doc-improvements')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Back to All Improvements
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Documentation Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Documentation Type
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">
                      {docTypes.find(type => type.value === improvement.docType)?.icon || '📄'}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {docTypes.find(type => type.value === improvement.docType)?.label || improvement.docType}
                    </span>
                  </div>
                </div>

                {/* Specific Page */}
                {improvement.specificPage && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specific Page/Section
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{improvement.specificPage}</span>
                    </div>
                  </div>
                )}

                {/* Issue Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Type
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">
                      {issueTypes.find(issue => issue.value === improvement.issueType)?.icon || '❓'}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {issueTypes.find(issue => issue.value === improvement.issueType)?.label || improvement.issueType}
                    </span>
                  </div>
                </div>

                {/* Created By */}
                {improvement.createdBy && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Submitted By
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-900">{improvement.createdBy.name || improvement.createdBy.email}</span>
                    </div>
                  </div>
                )}

                {/* Created Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Submitted On
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">
                      {new Date(improvement.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Contact Email */}
                {improvement.contactEmail && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a
                        href={`mailto:${improvement.contactEmail}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {improvement.contactEmail}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Issue Description
              </label>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {improvement.description}
                </p>
              </div>
            </div>

            {/* Suggested Fix */}
            {improvement.suggestedFix && (
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Suggested Fix
                </label>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {improvement.suggestedFix}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/all-doc-improvements')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
              >
                Back to All Improvements
              </button>
              <button
                onClick={() => navigate('/improve-docs')}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200"
              >
                Submit Another Suggestion
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DocImprovementDetailPage;
