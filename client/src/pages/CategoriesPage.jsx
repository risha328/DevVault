import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { categoriesAPI, resourcesAPI } from '../api/apiService';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Professional color scheme with better contrast
  const getCategoryColor = (category) => {
    const colorScheme = {
      'Web Development': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      'Mobile Development': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
      'Data Science': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      'Machine Learning': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
      'DevOps': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      'Cloud Computing': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
      'Cybersecurity': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
      'Blockchain': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      'Game Development': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
      'AI': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' }
    };
    
    return colorScheme[category] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  };

  // Fetch categories and resources
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [categoriesData, resourcesData] = await Promise.all([
          categoriesAPI.getAll(),
          resourcesAPI.getAll()
        ]);

        setCategories(categoriesData.data || categoriesData);
        setResources(resourcesData.data || resourcesData);
      } catch (err) {
        setError('Unable to load categories. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryStats = (categoryName) => {
    const categoryResources = resources.filter(resource => 
      resource.category === categoryName
    );
    
    return {
      count: categoryResources.length,
      recent: categoryResources.slice(0, 3).sort((a, b) => 
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )
    };
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (categoryName) => {
    navigate(`/browse-resources?category=${encodeURIComponent(categoryName)}`);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Knowledge Categories
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Explore curated learning resources organized by professional domains. 
              Find the perfect materials to advance your skills and knowledge.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
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

          {/* Categories Grid */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="text-gray-300 text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                {searchTerm ? 'No matching categories found' : 'No categories available'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms or browse all categories.'
                  : 'Categories will appear here once resources are added to the platform.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredCategories.length}</span> of{' '}
                  <span className="font-semibold">{categories.length}</span> categories
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => {
                  const stats = getCategoryStats(category.name);
                  const colors = getCategoryColor(category.name);
                  
                  return (
                    <div
                      key={category._id}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <div className="p-6">
                        {/* Category Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {category.name}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border} border`}>
                            {stats.count} {stats.count === 1 ? 'resource' : 'resources'}
                          </span>
                        </div>

                        {/* Recent Resources */}
                        {stats.recent.length > 0 ? (
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Recent Additions
                            </h4>
                            <div className="space-y-2">
                              {stats.recent.map((resource) => (
                                <div 
                                  key={resource._id} 
                                  className="text-sm text-gray-600 truncate hover:text-gray-900 transition-colors duration-200 flex items-center"
                                >
                                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3 flex-shrink-0"></span>
                                  {resource.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="mb-6 text-center py-4 text-gray-400">
                            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm">No resources yet</p>
                          </div>
                        )}

                        {/* Action Button */}
                        <button
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center group/btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(category.name);
                          }}
                        >
                          Explore Category
                          <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriesPage;