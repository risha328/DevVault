import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FeatureSuggestionDetailPage = () => {
  const { id } = useParams();
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    { value: 'ui-ux', label: 'UI/UX Improvements', icon: '🎨' },
    { value: 'functionality', label: 'New Functionality', icon: '⚙️' },
    { value: 'performance', label: 'Performance', icon: '⚡' },
    { value: 'mobile', label: 'Mobile Experience', icon: '📱' },
    { value: 'integration', label: 'Integrations', icon: '🔗' },
    { value: 'content', label: 'Content Management', icon: '📝' },
    { value: 'social', label: 'Social Features', icon: '👥' },
    { value: 'other', label: 'Other', icon: '💡' }
  ];

  const priorities = {
    low: { label: 'Nice to Have', color: 'bg-blue-100 text-blue-800' },
    medium: { label: 'Should Have', color: 'bg-green-100 text-green-800' },
    high: { label: 'Must Have', color: 'bg-orange-100 text-orange-800' },
    'game-changer': { label: 'Game Changer', color: 'bg-purple-100 text-purple-800' }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchSuggestion();
  }, [id]);

  const fetchSuggestion = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5300/api/feature-suggestions/${id}`, {
        method: 'GET',
        headers,
      });

      const result = await response.json();

      if (response.ok) {
        setSuggestion(result.data);
      } else {
        setError(result.message || 'Failed to fetch suggestion');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.icon : '💡';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-700">{error}</p>
              <Link
                to="/feature-suggestions"
                className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Back to Suggestions
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!suggestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700">Suggestion not found</p>
              <Link
                to="/feature-suggestions"
                className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Back to Suggestions
              </Link>
            </div>
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
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">{getCategoryIcon(suggestion.category)}</span>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[suggestion.status]}`}>
                {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              {suggestion.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Priority: {priorities[suggestion.priority]?.label || suggestion.priority}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {new Date(suggestion.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{suggestion.description}</p>
            </div>

            {/* Use Case */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem Solved</h2>
              <p className="text-gray-700 leading-relaxed">{suggestion.useCase}</p>
            </div>

            {/* Benefits */}
            {suggestion.benefits && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Expected Benefits</h2>
                <p className="text-gray-700 leading-relaxed">{suggestion.benefits}</p>
              </div>
            )}

            {/* Alternatives */}
            {suggestion.alternatives && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Alternative Solutions</h2>
                <p className="text-gray-700 leading-relaxed">{suggestion.alternatives}</p>
              </div>
            )}

            {/* Contact */}
            {suggestion.contactEmail && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-700">{suggestion.contactEmail}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200">
              <Link
                to="/feature-suggestions"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200"
              >
                ← Back to All Suggestions
              </Link>
              <Link
                to="/suggest-features"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Suggest Similar Feature
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeatureSuggestionDetailPage;
