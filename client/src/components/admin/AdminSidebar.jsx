import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Resources', path: '/admin/resources' },
    { name: 'Discussions', path: '/admin/discussions' },
    { name: 'Reports', path: '/admin/reports' },
    // { name: 'Issues', path: '/admin/issues' },
    { name: 'Feature Suggestions', path: '/admin/feature-suggestions' },
    { name: 'Doc Improvements', path: '/admin/doc-improvements' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="text-white flex items-center space-x-2 px-4">
        <span className="text-2xl font-extrabold">Admin Panel</span>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`block py-2.5 px-4 rounded transition duration-200 ${
              location.pathname === item.path
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
