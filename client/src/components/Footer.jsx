import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">DV</span>
              </div>
              <span className="text-xl font-bold">DevVault</span>
            </div>
            <p className="text-gray-400">
              Your ultimate development resource hub for learning and sharing knowledge.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/resources" className="hover:text-white">All Resources</Link></li>
              <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
              <li><Link to="/add-resource" className="hover:text-white">Add Resource</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/discussions" className="hover:text-white">Discussions</Link></li>
              <li><Link to="/bookmarks" className="hover:text-white">Bookmarks</Link></li>
              <li><Link to="/profile" className="hover:text-white">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 DevVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
