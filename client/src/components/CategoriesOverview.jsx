import { Link } from 'react-router-dom';

const CategoriesOverview = () => {
  const categoryMapping = {
    'Frontend': 'Web Development',
    'Backend': 'Backend Development',
    'DevOps': 'DevOps',
    'Mobile': 'Mobile Development',
    'Data Science': 'Data Science',
    'Cloud': 'Cloud Computing'
  };

  const categories = [
    {
      name: 'Frontend',
      icon: '🎨',
      description: 'HTML, CSS, JavaScript, React, Vue',
      gradient: 'from-purple-500 to-blue-500',
      link: '/browse-resources?category=Web%20Development'
    },
    {
      name: 'Backend',
      icon: '⚙️',
      description: 'Node.js, Python, Java, APIs',
      gradient: 'from-green-500 to-teal-500',
      link: '/browse-resources?category=Backend%20Development'
    },
    {
      name: 'DevOps',
      icon: '🚀',
      description: 'Docker, Kubernetes, CI/CD',
      gradient: 'from-orange-500 to-red-500',
      link: '/browse-resources?category=DevOps'
    },
    {
      name: 'Mobile',
      icon: '📱',
      description: 'React Native, Flutter, iOS, Android',
      gradient: 'from-blue-500 to-indigo-500',
      link: '/browse-resources?category=Mobile%20Development'
    },
    {
      name: 'Data Science',
      icon: '📊',
      description: 'Python, R, Machine Learning',
      gradient: 'from-pink-500 to-rose-500',
      link: '/browse-resources?category=Data%20Science'
    },
    {
      name: 'Cloud',
      icon: '☁️',
      description: 'AWS, Azure, GCP, Serverless',
      gradient: 'from-cyan-500 to-blue-500',
      link: '/browse-resources?category=Cloud%20Computing'
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <span className="text-2xl">📚</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Development Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive collection of resources across all major development domains. 
            Master the skills that matter in today's tech landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.gradient} rounded-t-2xl`}></div>
              
              {/* Icon container */}
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${category.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{category.icon}</span>
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-200">
                {category.name}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {category.description}
              </p>
              
              {/* CTA */}
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-200">
                <span>Explore Resources</span>
                <svg 
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-8 text-lg">
            Can't find what you're looking for?
          </p>
          <Link
            to="/categories"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <span>View All Categories</span>
            <svg 
              className="w-5 h-5 ml-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesOverview;