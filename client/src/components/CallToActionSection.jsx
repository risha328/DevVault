import { Link } from 'react-router-dom';

const CallToActionSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Share Your Knowledge?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Contribute to the developer community by sharing your expertise and resources
        </p>
        <Link
          to="/add-resource"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 text-lg"
        >
          Add Your Resource
        </Link>
      </div>
    </section>
  );
};

export default CallToActionSection;
