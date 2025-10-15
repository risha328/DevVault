import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AddResources = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    category: '',
    tags: ''
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5300/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        } else {
          setMessage('Failed to load categories');
        }
      } catch (error) {
        setMessage('Error loading categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear message when user starts typing
    if (message) setMessage('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setMessage('Title is required');
      return false;
    }
    if (!formData.link.trim()) {
      setMessage('Link is required');
      return false;
    }
    if (!formData.category) {
      setMessage('Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please sign in to add a resource');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5300/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          link: formData.link.trim(),
          category: formData.category,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('🎉 Resource added successfully! It will be reviewed before approval.');
        setFormData({
          title: '',
          description: '',
          link: '',
          category: '',
          tags: ''
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to add resource. Please try again.');
      }
    } catch (error) {
      setMessage('🚨 Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-visible">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Add New Resource
              </h1>
              <p className="text-gray-600">
                Share a valuable resource with the developer community
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter resource title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the resource (optional)"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                />
              </div>

              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                  Link *
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  placeholder="https://example.com"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                {isLoadingCategories ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-t-2 border-blue-500 border-solid rounded-full animate-spin mr-2"></div>
                      Loading categories...
                    </div>
                  </div>
                ) : (
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Game Development">Game Development</option>
                    <option value="AI">AI</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  placeholder="javascript, react, tutorial (comma-separated)"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate tags with commas (optional)
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || isLoadingCategories}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    Adding Resource...
                  </div>
                ) : (
                  'Add Resource'
                )}
              </button>
            </form>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-center ${
                message.includes('successful')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                <button
                  onClick={() => navigate('/')}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                >
                  ← Back to Home
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddResources;
