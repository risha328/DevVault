import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { adminAPI } from '../api/apiService';
import {
  Users,
  FileText,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Clock
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define colors for the pie chart
  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444']; // Green, Yellow, Blue, Red

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getDashboardStats();

        if (response.success) {
          // Transform stats data
          const transformedStats = [
            {
              title: 'Total Users',
              value: response.stats.totalUsers.value,
              change: response.stats.totalUsers.change,
              changeType: response.stats.totalUsers.changeType,
              icon: Users,
              color: 'bg-blue-500',
              bgColor: 'bg-blue-50',
              textColor: 'text-blue-600'
            },
            {
              title: 'Total Resources',
              value: response.stats.totalResources.value,
              change: response.stats.totalResources.change,
              changeType: response.stats.totalResources.changeType,
              icon: FileText,
              color: 'bg-green-500',
              bgColor: 'bg-green-50',
              textColor: 'text-green-600'
            },
            {
              title: 'Active Discussions',
              value: response.stats.activeDiscussions.value,
              change: response.stats.activeDiscussions.change,
              changeType: response.stats.activeDiscussions.changeType,
              icon: MessageSquare,
              color: 'bg-yellow-500',
              bgColor: 'bg-yellow-50',
              textColor: 'text-yellow-600'
            },
            {
              title: 'Open Issues',
              value: response.stats.openIssues.value,
              change: response.stats.openIssues.change,
              changeType: response.stats.openIssues.changeType,
              icon: AlertTriangle,
              color: 'bg-red-500',
              bgColor: 'bg-red-50',
              textColor: 'text-red-600'
            },
          ];

          setStats(transformedStats);
          setUserGrowthData(response.userGrowthData);
          setCategoryData(response.categoryData);
          setRecentActivities(response.recentActivities);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Last 30 days</span>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`h-4 w-4 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-medium ml-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User & Resource Growth</h3>
                <p className="text-sm text-gray-600">Monthly growth trends</p>
              </div>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar
                  dataKey="users"
                  fill="#3B82F6"
                  name="Users"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="resources"
                  fill="#10B981"
                  name="Resources"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Content Distribution</h3>
                <p className="text-sm text-gray-600">By category</p>
              </div>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <p className="text-sm text-gray-600">Latest platform activities</p>
              </div>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{activity.user}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.type === 'user' ? 'bg-blue-100 text-blue-800' :
                        activity.type === 'resource' ? 'bg-green-100 text-green-800' :
                        activity.type === 'discussion' ? 'bg-yellow-100 text-yellow-800' :
                        activity.type === 'issue' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {activity.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
