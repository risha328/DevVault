import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SuggestFeaturesPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    useCase: '',
    benefits: '',
    alternatives: '',
    priority: 'medium',
    contactEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'ui-ux', label: 'UI/UX Improvements', icon: '🎨', description: 'Design and user experience enhancements' },
    { value: 'functionality', label: 'New Functionality', icon: '⚙️', description: 'New features and capabilities' },
    { value: 'performance', label: 'Performance', icon: '⚡', description: 'Speed, optimization, and efficiency' },
    { value: 'mobile', label: 'Mobile Experience', icon: '📱', description: 'Mobile app or responsive improvements' },
    { value: 'integration', label: 'Integrations', icon: '🔗', description: 'Third-party service integrations' },
    { value: 'content', label: 'Content Management', icon: '📝', description: 'Content organization and management' },
    { value: 'social', label: 'Social Features', icon: '👥', description: 'Community and social interactions' },
    { value: 'other', label: 'Other', icon: '💡', description: 'Miscellaneous suggestions' }
  ];

  const priorities = [
    { value: 'low', label: 'Nice to Have', color: 'bg-blue-100 text-blue-800', description: 'Would be convenient but not essential' },
    { value: 'medium', label: 'Should Have', color: 'bg-green-100 text-green-800', description: 'Important for better user experience' },
    { value: 'high', label: 'Must Have', color: 'bg-orange-100 text-orange-800', description: 'Critical for platform success' },
    { value: 'game-changer', label: 'Game Changer', color: 'bg-purple-100 text-purple-800', description: 'Could transform the platform' }
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
      const response = await fetch('http://localhost:5300/api/feature-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Feature suggestion submitted successfully! Thank you for helping shape DevVault\'s future.');
        setFormData({
          category: '',
          title: '',
          description: '',
          useCase: '',
          benefits: '',
          alternatives: '',
          priority: 'medium',
          contactEmail: ''
        });

        setTimeout(() => {
          navigate('/feature-suggestions');
        }, 3000);
      } else {
        setMessage(`❌ ${result.message || 'Failed to submit suggestion. Please try again.'}`);
      }
    } catch (error) {
      setMessage('❌ Failed to submit suggestion. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Suggest a <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-blue-300">Feature</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              Have an idea to make DevVault better? Share your feature suggestions and help shape the future of developer resources.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Innovative Ideas Welcome
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Community-Driven Development
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Direct Impact
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suggestion Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Category */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  What category does your suggestion fit into?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <label
                      key={category.value}
                      className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.category === category.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={formData.category === category.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{category.label}</div>
                          <div className="text-sm text-gray-600 mt-1">{category.description}</div>
                        </div>
                      </div>
                      {formData.category === category.value && (
                        <div className="absolute top-4 right-4 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  How important is this feature to you?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {priorities.map((priority) => (
                    <label
                      key={priority.value}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.priority === priority.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        checked={formData.priority === priority.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${priority.color} mb-2`}>
                          {priority.label}
                        </div>
                        <div className="text-xs text-gray-600">{priority.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-lg font-semibold text-gray-900 mb-2">
                  Feature Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief, descriptive title for your feature suggestion"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-lg font-semibold text-gray-900 mb-2">
                  Feature Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the feature. Explain what it does and how it works."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Use Case */}
              <div>
                <label htmlFor="useCase" className="block text-lg font-semibold text-gray-900 mb-2">
                  Use Case & Problem Solved *
                </label>
                <textarea
                  id="useCase"
                  name="useCase"
                  value={formData.useCase}
                  onChange={handleInputChange}
                  placeholder="Describe the specific problem this feature would solve and who would benefit from it."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Benefits */}
              <div>
                <label htmlFor="benefits" className="block text-lg font-semibold text-gray-900 mb-2">
                  Expected Benefits
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  placeholder="What benefits would this feature bring to users and the platform?"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Alternatives */}
              <div>
                <label htmlFor="alternatives" className="block text-lg font-semibold text-gray-900 mb-2">
                  Alternative Solutions
                </label>
                <textarea
                  id="alternatives"
                  name="alternatives"
                  value={formData.alternatives}
                  onChange={handleInputChange}
                  placeholder="Have you considered any alternative solutions? How does your suggestion compare?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-sm text-gray-600 mt-1">We'll use this to discuss your suggestion in more detail if needed.</p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                      Submit Feature Suggestion
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

      {/* Tips Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tips for Great Feature Suggestions</h2>
            <p className="text-lg text-gray-600">Help us understand and implement your ideas better</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Be Specific</h3>
              </div>
              <p className="text-gray-600">Describe exactly what you want, how it should work, and what the user experience should be like.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Explain the Value</h3>
              </div>
              <p className="text-gray-600">Help us understand why this feature matters. Who benefits and how does it improve the platform?</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Consider Feasibility</h3>
              </div>
              <p className="text-gray-600">Think about technical constraints, timeline, and resources needed for implementation.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Share Examples</h3>
              </div>
              <p className="text-gray-600">Reference similar features from other platforms or provide mockups if possible.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuggestFeaturesPage;
