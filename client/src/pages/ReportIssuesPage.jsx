import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ReportIssuesPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    issueType: '',
    title: '',
    description: '',
    severity: 'medium',
    affectedPage: '',
    browserInfo: '',
    steps: '',
    expectedBehavior: '',
    actualBehavior: '',
    contactEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const issueTypes = [
    { value: 'bug', label: 'Bug Report', icon: '🐛', description: 'Something is broken or not working as expected' },
    { value: 'broken-link', label: 'Broken Link', icon: '🔗', description: 'A link is not working or leads to the wrong page' },
    { value: 'performance', label: 'Performance Issue', icon: '⚡', description: 'Page loads slowly or has performance problems' },
    { value: 'ui-ux', label: 'UI/UX Problem', icon: '🎨', description: 'Design or user experience issues' },
    { value: 'accessibility', label: 'Accessibility Issue', icon: '♿', description: 'Problems with screen readers or keyboard navigation' },
    { value: 'other', label: 'Other', icon: '❓', description: 'Something else that needs attention' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800', description: 'Minor issue, doesn\'t affect core functionality' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Moderate issue affecting some users' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', description: 'Major issue affecting many users' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', description: 'Critical issue breaking core functionality' }
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

      setMessage('✅ Issue reported successfully! Thank you for helping us improve DevVault.');
      setFormData({
        issueType: '',
        title: '',
        description: '',
        severity: 'medium',
        affectedPage: '',
        browserInfo: '',
        steps: '',
        expectedBehavior: '',
        actualBehavior: '',
        contactEmail: ''
      });

      setTimeout(() => {
        navigate('/contribute');
      }, 3000);

    } catch (error) {
      setMessage('❌ Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Report an <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">Issue</span>
            </h1>
            <p className="text-xl md:text-2xl text-red-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              Help us improve DevVault by reporting bugs, broken links, or other technical issues you encounter.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-red-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Quick Response
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Detailed Tracking
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Community Impact
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Issue Type */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  What type of issue are you reporting?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {issueTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.issueType === type.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="issueType"
                        value={type.value}
                        checked={formData.issueType === type.value}
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
                      {formData.issueType === type.value && (
                        <div className="absolute top-4 right-4 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  How severe is this issue?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {severityLevels.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.severity === level.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="severity"
                        value={level.value}
                        checked={formData.severity === level.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${level.color} mb-2`}>
                          {level.label}
                        </div>
                        <div className="text-xs text-gray-600">{level.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-lg font-semibold text-gray-900 mb-2">
                  Issue Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief, descriptive title for the issue"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-lg font-semibold text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the issue. Include as much information as possible."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Affected Page */}
              <div>
                <label htmlFor="affectedPage" className="block text-lg font-semibold text-gray-900 mb-2">
                  Affected Page/Section
                </label>
                <input
                  type="text"
                  id="affectedPage"
                  name="affectedPage"
                  value={formData.affectedPage}
                  onChange={handleInputChange}
                  placeholder="e.g., /browse-resources, Homepage Hero Section, Sign In Form"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Browser Info */}
              <div>
                <label htmlFor="browserInfo" className="block text-lg font-semibold text-gray-900 mb-2">
                  Browser & Device Information
                </label>
                <input
                  type="text"
                  id="browserInfo"
                  name="browserInfo"
                  value={formData.browserInfo}
                  onChange={handleInputChange}
                  placeholder="e.g., Chrome 91.0, Windows 10, Mobile Safari iOS 14"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Steps to Reproduce */}
              <div>
                <label htmlFor="steps" className="block text-lg font-semibold text-gray-900 mb-2">
                  Steps to Reproduce
                </label>
                <textarea
                  id="steps"
                  name="steps"
                  value={formData.steps}
                  onChange={handleInputChange}
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Expected vs Actual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="expectedBehavior" className="block text-lg font-semibold text-gray-900 mb-2">
                    Expected Behavior
                  </label>
                  <textarea
                    id="expectedBehavior"
                    name="expectedBehavior"
                    value={formData.expectedBehavior}
                    onChange={handleInputChange}
                    placeholder="What should happen?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="actualBehavior" className="block text-lg font-semibold text-gray-900 mb-2">
                    Actual Behavior
                  </label>
                  <textarea
                    id="actualBehavior"
                    name="actualBehavior"
                    value={formData.actualBehavior}
                    onChange={handleInputChange}
                    placeholder="What actually happens?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-sm text-gray-600 mt-1">We'll use this to follow up if we need more information.</p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                      Submitting Issue...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Issue Report
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

      <Footer />
    </div>
  );
};

export default ReportIssuesPage;
