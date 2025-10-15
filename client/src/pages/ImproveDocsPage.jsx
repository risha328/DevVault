import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ImproveDocsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    docType: '',
    specificPage: '',
    issueType: '',
    description: '',
    suggestedFix: '',
    contactEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessage('✅ Documentation improvement suggestion submitted successfully! Thank you for helping improve our docs.');
      setFormData({
        docType: '',
        specificPage: '',
        issueType: '',
        description: '',
        suggestedFix: '',
        contactEmail: ''
      });

      setTimeout(() => {
        navigate('/contribute');
      }, 3000);

    } catch (error) {
      setMessage('❌ Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
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
              Improve <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">Documentation</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              Help us maintain clear, accurate, and helpful documentation for all DevVault users.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-indigo-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 9a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Better User Experience
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Accurate Information
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Community Knowledge
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Improvement Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Documentation Type */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Which type of documentation needs improvement?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {docTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.docType === type.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="docType"
                        value={type.value}
                        checked={formData.docType === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                        </div>
                      </div>
                      {formData.docType === type.value && (
                        <div className="absolute top-4 right-4 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Specific Page */}
              <div>
                <label htmlFor="specificPage" className="block text-lg font-semibold text-gray-900 mb-2">
                  Specific Page or Section
                </label>
                <input
                  type="text"
                  id="specificPage"
                  name="specificPage"
                  value={formData.specificPage}
                  onChange={handleInputChange}
                  placeholder="e.g., Installation Guide, API Reference, Getting Started"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  What type of issue did you find?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {issueTypes.map((issue) => (
                    <label
                      key={issue.value}
                      className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.issueType === issue.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="issueType"
                        value={issue.value}
                        checked={formData.issueType === issue.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{issue.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{issue.label}</div>
                          <div className="text-sm text-gray-600 mt-1">{issue.description}</div>
                        </div>
                      </div>
                      {formData.issueType === issue.value && (
                        <div className="absolute top-4 right-4 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-lg font-semibold text-gray-900 mb-2">
                  Describe the Issue *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please describe the documentation issue in detail. What specifically needs to be improved?"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Suggested Fix */}
              <div>
                <label htmlFor="suggestedFix" className="block text-lg font-semibold text-gray-900 mb-2">
                  Suggested Fix or Improvement
                </label>
                <textarea
                  id="suggestedFix"
                  name="suggestedFix"
                  value={formData.suggestedFix}
                  onChange={handleInputChange}
                  placeholder="If you have a specific suggestion for how to fix this, please share it here. Include exact wording changes if applicable."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="contactEmail" className="block text-lg font-semibold text-gray-900 mb-2">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-sm text-gray-600 mt-1">We'll use this to discuss your suggestion in more detail if needed.</p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                      Submitting Suggestion...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Documentation Improvement
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Success/Error Message */}
            {message && (
              <div className={`mt-6 p-4 rounded-lg text-center ${
                message.includes('successfully')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Other Ways to Help</h2>
            <p className="text-lg text-gray-600">While you're here, consider these other contribution opportunities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center group hover:shadow-xl transition-all duration-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Issues</h3>
              <p className="text-gray-600 text-sm mb-4">Found a bug or technical issue? Let us know.</p>
              <button
                onClick={() => navigate('/report-issues')}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Report Issue →
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center group hover:shadow-xl transition-all duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Suggest Features</h3>
              <p className="text-gray-600 text-sm mb-4">Have an idea to improve DevVault? Share it with us.</p>
              <button
                onClick={() => navigate('/suggest-features')}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                Suggest Feature →
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center group hover:shadow-xl transition-all duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Resources</h3>
              <p className="text-gray-600 text-sm mb-4">Share valuable learning materials with the community.</p>
              <button
                onClick={() => navigate('/add-resources')}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Add Resource →
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ImproveDocsPage;
