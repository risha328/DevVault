import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BrowseResources = () => {
  const defaultCategories = [
    { _id: '1', name: 'Web Development' },
    { _id: '2', name: 'Mobile Development' },
    { _id: '3', name: 'Data Science' },
    { _id: '4', name: 'Machine Learning' },
    { _id: '5', name: 'DevOps' },
    { _id: '6', name: 'Cloud Computing' },
    { _id: '7', name: 'Cybersecurity' },
    { _id: '8', name: 'Blockchain' },
    { _id: '9', name: 'Game Development' },
    { _id: '10', name: 'AI' }
  ];

  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch resources and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch resources
        const resourcesResponse = await fetch('http://localhost:5300/api/resources');
        const resourcesData = await resourcesResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:5300/api/categories');
        const categoriesData = await categoriesResponse.json();

        if (resourcesData.success) {
          setResources(resourcesData.data);
          setFilteredResources(resourcesData.data);
        }

        if (categoriesData.success && categoriesData.data && categoriesData.data.length > 0) {
          setCategories(categoriesData.data);
        } else {
          // Fallback to default categories if API fails or returns empty data
          setCategories(defaultCategories);
        }
      } catch (error) {
        setMessage('Error loading resources');
        // Fallback to default categories if API fails
        setCategories(defaultCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle URL query parameter for category filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  // Filter resources based on category and search query
  useEffect(() => {
    let filtered = resources;

    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredResources(filtered);
  }, [selectedCategory, searchQuery, resources]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Web Development': 'bg-blue-100 text-blue-800',
      'Mobile Development': 'bg-green-100 text-green-800',
      'Data Science': 'bg-purple-100 text-purple-800',
      'Machine Learning': 'bg-orange-100 text-orange-800',
      'DevOps': 'bg-red-100 text-red-800',
      'Cloud Computing': 'bg-indigo-100 text-indigo-800',
      'Cybersecurity': 'bg-gray-100 text-gray-800',
      'Blockchain': 'bg-yellow-100 text-yellow-800',
      'Game Development': 'bg-pink-100 text-pink-800',
      'AI': 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Browse Resources
            </h1>
            <p className="text-gray-600">
              Discover valuable resources shared by the developer community
            </p>
          </div>

          {/* Categories Section */}
          {/* <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Category
                  </label>
                  <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Categories ({resources.length} resources)</option>
                    {categories.map((category) => {
                      const categoryResources = resources.filter(r => r.category === category.name);
                      return (
                        <option key={category._id} value={category.name}>
                          {category.name} ({categoryResources.length} resources)
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="md:w-48">
                  <div className="text-sm text-gray-600 mt-8 md:mt-0">
                    <div className="font-semibold">Quick Stats</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedCategory
                        ? `${resources.filter(r => r.category === selectedCategory).length} resources in ${selectedCategory}`
                        : `${resources.length} total resources`
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Search Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 overflow-visible">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => {
                    const categoryResources = resources.filter(r => r.category === category.name);
                    return (
                      <option key={category._id} value={category.name}>
                        {category.name} ({categoryResources.length} resources)
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No resources found</h3>
              <p className="text-gray-500">
                {searchQuery || selectedCategory
                  ? 'Try adjusting your search or filter criteria'
                  : 'Be the first to add a resource!'
                }
              </p>
              {!searchQuery && !selectedCategory && (
                <button
                  onClick={() => navigate('/add-resources')}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                  Add First Resource
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div
                  key={resource._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {resource.description || 'No description provided'}
                    </p>

                    {/* Category */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(resource.category)}`}>
                        {resource.category}
                      </span>
                    </div>

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {resource.tags.length > 3 && (
                            <span className="text-gray-400 text-xs">
                              +{resource.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Link */}
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Resource
                    </a>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <span>By {resource.author?.name || 'Anonymous'}</span>
                      <span>{formatDate(resource.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="mt-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center">
              {message}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BrowseResources;
