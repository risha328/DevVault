import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Users, BarChart3, FileText, MessageSquare, Bookmark, FileBarChart, Lightbulb, Edit, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Resources', path: '/admin/resources', icon: FileText },
    { name: 'Discussions', path: '/admin/discussions', icon: MessageSquare },
    { name: 'Bookmarks', path: '/admin/bookmarks', icon: Bookmark },
    { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
    { name: 'Leaderboard', path: '/admin/leaderboard', icon: Trophy },
    // { name: 'Issues', path: '/admin/issues' },
    { name: 'Feature Suggestions', path: '/admin/feature-suggestions', icon: Lightbulb },
    { name: 'Doc Improvements', path: '/admin/docs-improvements', icon: Edit },
  ];

  return (
    <div className={`bg-gray-800 text-white ${isCollapsed ? 'w-16' : 'w-64'} space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
      <div className="text-white flex items-center justify-between px-4">
        {!isCollapsed && <span className="text-2xl font-extrabold">Admin Panel</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-gray-700 p-1 rounded transition duration-200"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} py-2.5 px-4 rounded transition duration-200 ${
              location.pathname === item.path
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            title={isCollapsed ? item.name : ''}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
