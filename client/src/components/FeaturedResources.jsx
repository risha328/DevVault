import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourcesAPI } from '../api/apiService';

const FeaturedResources = () => {
  const [featuredResources, setFeaturedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedResources = async () => {
      try {
        const response = await resourcesAPI.getFeatured();
        setFeaturedResources(response.data);
      } catch (err) {
        console.error('Error fetching featured resources:', err);
        setError('Failed to load featured resources');
        // Fallback to static data if API fails
        setFeaturedResources([
          {
            _id: 1,
            title: 'React Best Practices 2024',
            createdBy: { name: 'Sarah Chen' },
            category: 'Frontend',
            upvotes: [1, 2, 3, 4, 5], // Mock upvotes for rating
            createdAt: new Date(),
            link: 'https://example.com',
          },
          {
            _id: 2,
            title: 'Node.js Microservices Architecture',
            createdBy: { name: 'Mike Johnson' },
            category: 'Backend',
            upvotes: [1, 2, 3, 4, 5, 6, 7, 8, 9], // Mock upvotes
            createdAt: new Date(),
            link: 'https://example.com',
          },
          {
            _id: 3,
            title: 'Docker & Containerization Guide',
            createdBy: { name: 'Alex Rodriguez' },
            category: 'DevOps',
            upvotes: [1, 2, 3, 4, 5, 6, 7], // Mock upvotes
            createdAt: new Date(),
            link: 'https://example.com',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedResources();
  }, []);

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating}
        </span>
      </div>
    );
  };

  const CategoryBadge = ({ category }) => {
    const categoryColors = {
      Frontend: 'bg-blue-100 text-blue-800 border-blue-200',
      Backend: 'bg-green-100 text-green-800 border-green-200',
      DevOps: 'bg-purple-100 text-purple-800 border-purple-200',
      Mobile: 'bg-orange-100 text-orange-800 border-orange-200',
      Database: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
        categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
      }`}>
        {category}
      </span>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
            Featured Content
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Premium Learning Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Curated collection of high-quality tutorials, guides, and tools 
            handpicked by industry experts to accelerate your development journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
                      ))}
                    </div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">{error}</p>
            </div>
          ) : (
            featuredResources.map((resource) => {
              const rating = Math.floor(resource.upvotes?.length / 2) + 1 || 4; // Calculate rating from upvotes
              const reviews = resource.upvotes?.length || 0;
              const duration = 'Read time'; // Placeholder since we don't have this field

              return (
                <div
                  key={resource._id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-${resource._id === 1 ? '1633356122544-f134324a6cee' : resource._id === 2 ? '1627398242454-45a1465c2479' : '1558494949-ef010cbdcc31'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`}
                      alt={resource.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <CategoryBadge category={resource.category} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <StarRating rating={rating} />
                      <span className="text-sm text-gray-500">{duration}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                      {resource.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                          {resource.createdBy?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-gray-700 font-medium">By {resource.createdBy?.name || 'Unknown'}</span>
                      </div>
                      <span className="text-sm text-gray-500">{reviews} upvotes</span>
                    </div>

                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl inline-block text-center"
                    >
                      Explore Resource
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="text-center">
          <Link
            to="/resources"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] border border-gray-200 hover:border-blue-300"
          >
            Browse All Resources
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <p className="text-gray-500 mt-4 text-sm">
            Join 10,000+ developers already learning with DevVault
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResources;