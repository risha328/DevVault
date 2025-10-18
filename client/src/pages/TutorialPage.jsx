import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { tutorialsAPI } from '../api/apiService';

const TutorialPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const data = await tutorialsAPI.getById(id);
        setTutorial(data.tutorial);
        setLikes(data.tutorial.likes?.length || 0);

        // Check if current user liked the tutorial
        const token = localStorage.getItem('token');
        if (token) {
          const userId = JSON.parse(atob(token.split('.')[1])).id;
          setIsLiked(data.tutorial.likes?.includes(userId) || false);
        }
      } catch (error) {
        console.error('Error fetching tutorial:', error);
        if (error.message.includes('401') || error.message.includes('Authentication')) {
          setMessage('Authentication required to access tutorials');
          navigate('/login');
        } else if (error.message.includes('404')) {
          setMessage('Tutorial not found');
        } else {
          setMessage('Unable to load tutorial. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutorial();
  }, [id, navigate]);

  const handleLike = async () => {
    if (isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      const data = await tutorialsAPI.like(id);
      setLikes(data.likes);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking tutorial:', error);
      setMessage('Failed to like tutorial. Please try again.');
    } finally {
      setIsLikeLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'intermediate': 'bg-amber-50 text-amber-700 border-amber-200',
      'advanced': 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return colors[difficulty.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getDifficultyIcon = (difficulty) => {
    const icons = {
      'beginner': '🟢',
      'intermediate': '🟡',
      'advanced': '🔴'
    };
    return icons[difficulty.toLowerCase()] || '⚪';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading tutorial...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-gray-300 text-8xl mb-6">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Tutorial Not Found</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              The tutorial you're looking for doesn't exist or may have been removed. 
              Explore our other resources to continue learning.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/browse-resources')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Browse Resources
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button 
              onClick={() => navigate('/browse-resources')}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Resources
            </button>
            <span>›</span>
            <span className="text-gray-400">{tutorial.category}</span>
            <span>›</span>
            <span className="text-gray-600 font-medium truncate">{tutorial.title}</span>
          </nav>

          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(tutorial.difficulty)}`}>
                    {getDifficultyIcon(tutorial.difficulty)} {tutorial.difficulty}
                  </span>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200">
                    {tutorial.category}
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {tutorial.title}
                </h1>
                
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {tutorial.description}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {tutorial.createdByName?.charAt(0) || 'A'}
                    </div>
                    <span>By {tutorial.createdByName || 'Anonymous'}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDate(tutorial.createdAt)}</span>
                  {tutorial.estimatedTime && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {tutorial.estimatedTime} min read
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {tutorial.views || 0} views
                  </span>
                </div>
              </div>

              {/* Like Button */}
              <button
                onClick={handleLike}
                disabled={isLikeLoading}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border ${
                  isLiked
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:shadow-lg'
                } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLikeLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg 
                    className={`w-6 h-6 transition-transform duration-200 ${isLiked ? 'scale-110' : ''}`} 
                    fill={isLiked ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
                <span className="text-lg">{likes}</span>
              </button>
            </div>

            {/* Tags */}
            {tutorial.tags && tutorial.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tutorial.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Prerequisites & Learning Objectives Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Prerequisites */}
              {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Prerequisites
                  </h3>
                  <ul className="space-y-2">
                    {tutorial.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Objectives */}
              {tutorial.learningObjectives && tutorial.learningObjectives.length > 0 && (
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    What You'll Learn
                  </h3>
                  <ul className="space-y-2">
                    {tutorial.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <div className="bg-gray-900 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-400 text-sm font-mono">tutorial.md</span>
                </div>
                <pre className="text-gray-100 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {tutorial.content}
                </pre>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {tutorial.views || 0} views
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {likes} likes
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(tutorial.createdAt)}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/browse-resources')}
                  className="bg-white text-gray-700 px-6 py-2.5 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Resources
                </button>
                <button
                  onClick={handleLike}
                  disabled={isLikeLoading}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                    isLiked
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLikeLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                  {isLiked ? 'Liked' : 'Like'}
                </button>
              </div>
            </div>
          </div>

          {/* Message Toast */}
          {message && (
            <div className="fixed bottom-6 right-6 max-w-sm">
              <div className="bg-red-500 text-white p-4 rounded-xl shadow-2xl border border-red-200 transform transition-all duration-300 animate-in slide-in-from-right-full">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">{message}</p>
                  <button
                    onClick={() => setMessage('')}
                    className="ml-auto text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TutorialPage;