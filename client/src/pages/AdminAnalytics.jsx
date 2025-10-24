import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { adminAPI } from '../api/apiService';
import {
  Users,
  FileText,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
  Download,
  Filter,
  RefreshCw,
  Share2,
  MousePointerClick,
  Clock4,
  Target
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
  AreaChart,
  ComposedChart,
  Legend,
  ReferenceLine
} from 'recharts';

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Enhanced color schemes with better contrast
  const COLORS = {
    primary: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
    secondary: ['#6366F1', '#EC4899', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'],
    gradients: {
      blue: ['#3B82F6', '#1D4ED8'],
      green: ['#10B981', '#059669'],
      purple: ['#8B5CF6', '#7C3AED'],
      amber: ['#F59E0B', '#D97706']
    }
  };

  // Mock data structure for demonstration
  const mockAnalyticsData = {
    kpis: [
      { title: 'Total Users', value: 12458, change: 12.5, icon: Users },
      { title: 'Active Sessions', value: 8456, change: 8.2, icon: Activity },
      { title: 'Avg. Engagement', value: 4.2, change: -2.1, icon: Clock4 },
      { title: 'Conversion Rate', value: 3.8, change: 15.7, icon: Target }
    ],
    engagementTrends: [
      { date: 'Jan 1', activeUsers: 1200, engagementRate: 65, sessionDuration: 4.2, bounceRate: 32, conversions: 45 },
      { date: 'Jan 2', activeUsers: 1450, engagementRate: 68, sessionDuration: 4.5, bounceRate: 28, conversions: 52 },
      { date: 'Jan 3', activeUsers: 1320, engagementRate: 62, sessionDuration: 3.9, bounceRate: 35, conversions: 38 },
      { date: 'Jan 4', activeUsers: 1680, engagementRate: 72, sessionDuration: 4.8, bounceRate: 25, conversions: 61 },
      { date: 'Jan 5', activeUsers: 1540, engagementRate: 69, sessionDuration: 4.6, bounceRate: 29, conversions: 55 },
      { date: 'Jan 6', activeUsers: 1890, engagementRate: 75, sessionDuration: 5.1, bounceRate: 22, conversions: 68 },
      { date: 'Jan 7', activeUsers: 1760, engagementRate: 71, sessionDuration: 4.9, bounceRate: 26, conversions: 59 }
    ],
    contentPerformance: [
      { type: 'Articles', views: 4500, likes: 890, shares: 234, engagement: 4.2 },
      { type: 'Videos', views: 3200, likes: 1200, shares: 456, engagement: 5.8 },
      { type: 'Tutorials', views: 2800, likes: 760, shares: 189, engagement: 4.9 },
      { type: 'News', views: 1900, likes: 420, shares: 98, engagement: 3.5 },
      { type: 'Updates', views: 1200, likes: 310, shares: 67, engagement: 3.1 }
    ],
    trafficSources: [
      { name: 'Organic Search', value: 45, color: '#3B82F6' },
      { name: 'Direct', value: 25, color: '#10B981' },
      { name: 'Social Media', value: 15, color: '#F59E0B' },
      { name: 'Referral', value: 10, color: '#EF4444' },
      { name: 'Email', value: 5, color: '#8B5CF6' }
    ],
    conversionFunnel: [
      { name: 'Visitors', count: 10000, percentage: 100 },
      { name: 'Engaged Users', count: 6500, percentage: 65 },
      { name: 'Sign Ups', count: 2300, percentage: 23 },
      { name: 'Active Users', count: 1500, percentage: 15 },
      { name: 'Paying Customers', count: 380, percentage: 3.8 }
    ],
    detailedMetrics: [
      { name: 'Page Views', current: 45890, previous: 41200, change: 11.4 },
      { name: 'Unique Visitors', current: 24560, previous: 21800, change: 12.7 },
      { name: 'Avg. Session Duration', current: 4.2, previous: 3.8, change: 10.5 },
      { name: 'Bounce Rate', current: 32.1, previous: 35.6, change: -9.8 },
      { name: 'Conversion Rate', current: 3.8, previous: 3.3, change: 15.2 },
      { name: 'Revenue', current: 45800, previous: 39200, change: 16.8 }
    ]
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getAnalyticsData(timeRange);

        if (response.success) {
          // Transform backend data to match frontend structure
          const backendData = response.data;

          // Transform KPIs to match expected format
          const transformedKpis = backendData.kpis.map(kpi => ({
            title: kpi.title,
            value: kpi.value,
            change: kpi.change,
            icon: kpi.icon
          }));

          // Transform engagement trends to include session duration
          const transformedEngagementTrends = backendData.engagementTrends.map(trend => ({
            date: trend.date,
            activeUsers: trend.activeUsers,
            engagementRate: trend.engagementRate,
            sessionDuration: trend.sessionDuration || 4.2,
            bounceRate: trend.bounceRate || 32,
            conversions: trend.conversions || 0
          }));

          // Transform content performance
          const transformedContentPerformance = backendData.contentPerformance.map(content => ({
            type: content.type,
            views: content.views,
            likes: content.likes,
            shares: content.shares || 0,
            engagement: content.engagement || 0
          }));

          // Transform traffic sources with colors
          const transformedTrafficSources = backendData.trafficSources.map(source => ({
            name: source.name,
            value: source.value,
            color: source.color || '#3B82F6'
          }));

          // Transform conversion funnel
          const transformedConversionFunnel = backendData.conversionFunnel.map(step => ({
            name: step.name,
            count: step.count,
            percentage: step.percentage
          }));

          // Transform detailed metrics
          const transformedDetailedMetrics = backendData.detailedMetrics.map(metric => ({
            name: metric.name,
            current: metric.current,
            previous: metric.previous,
            change: metric.change
          }));

          setAnalyticsData({
            kpis: transformedKpis,
            engagementTrends: transformedEngagementTrends,
            contentPerformance: transformedContentPerformance,
            trafficSources: transformedTrafficSources,
            conversionFunnel: transformedConversionFunnel,
            detailedMetrics: transformedDetailedMetrics
          });
        } else {
          throw new Error('Failed to fetch analytics data');
        }
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[200px]">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 capitalize">{entry.dataKey.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
              </div>
              <span className="font-semibold text-gray-900">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                {entry.dataKey === 'engagementRate' || entry.dataKey === 'bounceRate' ? '%' : ''}
                {entry.dataKey === 'sessionDuration' ? 'min' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-800 text-lg font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Comprehensive insights into platform performance and user engagement</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-gray-700 font-medium"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 font-medium shadow-md">
              <Download className="h-5 w-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Enhanced Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsData.kpis?.map((kpi, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:border-indigo-100 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {typeof kpi.value === 'number' && kpi.title !== 'Avg. Engagement' 
                      ? formatNumber(kpi.value) 
                      : kpi.value}
                    {kpi.title === 'Avg. Engagement' && 'min'}
                  </p>
                  <div className="flex items-center">
                    {kpi.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(kpi.change)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors">
                  <kpi.icon className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Professional User Engagement Trends */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900">User Engagement Trends</h3>
                <p className="text-gray-600 mt-1">Comprehensive overview of user activity and engagement metrics</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600"></div>
                  <span>Active Users</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                  <span>Engagement Rate</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600"></div>
                  <span>Session Duration</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={analyticsData.engagementTrends} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                    <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="50%" stopColor="#10B981" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15}/>
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontWeight: 500 }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                  tick={{ fill: '#64748b', fontWeight: 500 }}
                  label={{ value: 'Users', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b', fontSize: '12px', fontWeight: '600' } }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                  tick={{ fill: '#64748b', fontWeight: 500 }}
                  label={{ value: 'Rate / Duration', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#64748b', fontSize: '12px', fontWeight: '600' } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={40}
                  iconType="rect"
                  iconSize={12}
                  wrapperStyle={{ paddingBottom: '10px' }}
                />

                {/* Area for Active Users */}
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#3B82F6"
                  fill="url(#userGradient)"
                  strokeWidth={2.5}
                  name="Active Users"
                  dot={false}
                  activeDot={{ r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }}
                />

                {/* Line for Engagement Rate */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="engagementRate"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  name="Engagement Rate (%)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))' }}
                  strokeDasharray="0"
                />

                {/* Line for Session Duration */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sessionDuration"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  name="Session Duration (min)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))' }}
                  strokeDasharray="0"
                />

                {/* Reference lines for benchmarks */}
                <ReferenceLine
                  yAxisId="right"
                  y={65}
                  stroke="#6B7280"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Target Engagement',
                    position: 'right',
                    fill: '#6B7280',
                    fontSize: 10,
                    fontWeight: '600'
                  }}
                />
                <ReferenceLine
                  yAxisId="right"
                  y={4.5}
                  stroke="#DC2626"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Avg Session',
                    position: 'right',
                    fill: '#DC2626',
                    fontSize: 10,
                    fontWeight: '600'
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Enhanced Content Performance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Content Performance</h3>
                <p className="text-gray-600 mt-1">Performance metrics across different content types</p>
              </div>
              <Eye className="h-5 w-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analyticsData.contentPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis 
                  dataKey="type" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar 
                  dataKey="views" 
                  fill="#3B82F6" 
                  name="Views" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="likes" 
                  fill="#10B981" 
                  name="Likes" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="shares" 
                  fill="#F59E0B" 
                  name="Shares" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traffic Sources with Enhanced Design */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Traffic Sources</h3>
                <p className="text-gray-600 text-sm">Distribution of user acquisition channels</p>
              </div>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex flex-col lg:flex-row items-center">
              <ResponsiveContainer width="100%" height={240}>
                <RechartsPieChart>
                  <Pie
                    data={analyticsData.trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.trafficSources?.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color || COLORS.primary[index % COLORS.primary.length]} 
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex flex-col space-y-3 mt-4 lg:mt-0 lg:ml-6 w-full lg:w-auto">
                {analyticsData.trafficSources?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color || COLORS.primary[index % COLORS.primary.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced User Demographics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">User Demographics</h3>
                <p className="text-gray-600 text-sm">Age distribution of platform users</p>
              </div>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-5">
              {[
                { range: '18-24', percentage: 35, color: '#3B82F6' },
                { range: '25-34', percentage: 28, color: '#10B981' },
                { range: '35-44', percentage: 22, color: '#F59E0B' },
                { range: '45-54', percentage: 10, color: '#EF4444' },
                { range: '55+', percentage: 5, color: '#8B5CF6' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.range}</span>
                    <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                        backgroundImage: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Conversion Funnel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Conversion Funnel</h3>
                <p className="text-gray-600 text-sm">User journey and conversion analysis</p>
              </div>
              <Target className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analyticsData.conversionFunnel?.map((step, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {step.name}
                      </div>
                      <div className="text-xs text-gray-500">{step.count.toLocaleString()} users</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{step.percentage}%</div>
                    {index > 0 && (
                      <div className="text-xs text-gray-500">
                        {((step.percentage / analyticsData.conversionFunnel[index - 1].percentage) * 100).toFixed(1)}% retention
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Detailed Metrics Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Detailed Performance Metrics</h3>
                <p className="text-gray-600">Comprehensive breakdown of key performance indicators</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Updated just now</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Current Period
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Previous Period
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.detailedMetrics?.map((metric, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {metric.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {typeof metric.current === 'number' ? formatNumber(metric.current) : metric.current}
                        {metric.name.includes('Rate') && !metric.name.includes('Bounce') ? '%' : ''}
                        {metric.name.includes('Duration') ? 'min' : ''}
                        {metric.name === 'Revenue' ? '$' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {typeof metric.previous === 'number' ? formatNumber(metric.previous) : metric.previous}
                        {metric.name.includes('Rate') && !metric.name.includes('Bounce') ? '%' : ''}
                        {metric.name.includes('Duration') ? 'min' : ''}
                        {metric.name === 'Revenue' ? '$' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        metric.change >= 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {metric.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {formatPercentage(metric.change)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`w-3 h-3 rounded-full ${
                        metric.change >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`} />
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

export default AdminAnalytics;