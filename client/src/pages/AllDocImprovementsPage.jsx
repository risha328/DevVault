import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { docImprovementsAPI } from '../api/apiService';

const AllDocImprovementsPage = () => {
  const navigate = useNavigate();
  const [improvements, setImprovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [docTypeFilter, setDocTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    fetchImprovements();
  }, []);

  const fetchImprovements = async () => {
    setLoading(true);
    try {
      const data = await docImprovementsAPI.getApproved();
      setImprovements(data.data || []);
    } catch (err) {
      console.error('Failed to fetch improvements:', err);
    } finally {
      setLoading(false);
    }
  };

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
              Approved Documentation <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">Improvements</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              View approved documentation improvement suggestions that have been implemented.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-indigo-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 9a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Community Approved
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Quality Improvements
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Better Documentation
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
                  placeholder="Search approved improvements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Doc Type Filter */}
              <select
                value={docTypeFilter}
                onChange={(e) => setDocTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {docTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Improvements List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : improvements.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No approved improvements yet</h3>
              <p className="text-gray-600 mb-6">Approved documentation improvements will appear here once they are reviewed and approved by administrators.</p>
              <button
                onClick={() => navigate('/improve-docs')}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200"
              >
                Suggest an Improvement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {improvements
                .filter(improvement => {
                  const matchesDocType = docTypeFilter === 'all' || improvement.docType === docTypeFilter;
                  const matchesSearch = searchQuery === '' ||
                    improvement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    improvement.suggestedFix?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    improvement.specificPage?.toLowerCase().includes(searchQuery.toLowerCase());

                  return matchesDocType && matchesSearch;
                })
                .map((improvement) => (
                  <div key={improvement._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer" onClick={() => navigate(`/doc-improvements/${improvement._id}`)}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {docTypes.find(type => type.value === improvement.docType)?.icon || '📄'}
                        </span>
                        <div className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Approved
                        </div>
                      </div>
                    </div>

                    {/* Doc Type and Page */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Documentation Type:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {docTypes.find(type => type.value === improvement.docType)?.label || improvement.docType}
                      </p>
                      {improvement.specificPage && (
                        <p className="text-sm text-gray-600 mt-1">Page: {improvement.specificPage}</p>
                      )}
                    </div>

                    {/* Issue Type */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Issue Type:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {issueTypes.find(issue => issue.value === improvement.issueType)?.label || improvement.issueType}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Description:</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{improvement.description}</p>
                    </div>

                    {/* Suggested Fix */}
                    {improvement.suggestedFix && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Suggested Fix:</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{improvement.suggestedFix}</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span>
                        Approved on: {new Date(improvement.updatedAt || improvement.createdAt).toLocaleDateString()}
                      </span>
                      {improvement.createdBy && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          User
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

export default AllDocImprovementsPage;
