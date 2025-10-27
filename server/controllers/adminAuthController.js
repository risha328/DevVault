const User = require("../models/User");
const Resource = require("../models/Resource");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({ name, email, password: hashed, role: "admin" });

    res.status(201).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select('-password');
    if (!admin || admin.role !== "admin") return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({
      success: true,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      name: admin.name,
      email: admin.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('createdBy', 'name email');
    res.json({ success: true, resources });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResourceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const resource = await Resource.findByIdAndUpdate(id, { status }, { new: true });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDiscussions = async (req, res) => {
  try {
    const Discussion = require("../models/Discussion");
    const discussions = await Discussion.find().populate('createdBy', 'name email');
    res.json({ success: true, discussions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDiscussionById = async (req, res) => {
  try {
    const Discussion = require("../models/Discussion");
    const discussion = await Discussion.findById(req.params.id).populate('createdBy', 'name email');
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    res.json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDiscussionReplies = async (req, res) => {
  try {
    const DiscussionReply = require("../models/DiscussionReply");
    const replies = await DiscussionReply.find({ discussionId: req.params.id }).populate('createdBy', 'name email').sort({ createdAt: 1 });
    res.json({ success: true, replies });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const Discussion = require("../models/Discussion");
    const Issue = require("../models/Issue");
    const FeatureSuggestion = require("../models/FeatureSuggestion");
    const DocImprovement = require("../models/DocImprovement");
    const ContentReport = require("../models/ContentReport");

    // Get current date and date from last month
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Get counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalResources = await Resource.countDocuments();
    const totalDiscussions = await Discussion.countDocuments();
    const totalIssues = await Issue.countDocuments();

    // Get previous month counts for percentage change calculation
    const prevMonthUsers = await User.countDocuments({
      role: 'user',
      createdAt: { $lt: lastMonth }
    });
    const prevMonthResources = await Resource.countDocuments({
      createdAt: { $lt: lastMonth }
    });
    const prevMonthDiscussions = await Discussion.countDocuments({
      createdAt: { $lt: lastMonth }
    });
    const prevMonthIssues = await Issue.countDocuments({
      createdAt: { $lt: lastMonth }
    });

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    const userChange = calculateChange(totalUsers, prevMonthUsers);
    const resourceChange = calculateChange(totalResources, prevMonthResources);
    const discussionChange = calculateChange(totalDiscussions, prevMonthDiscussions);
    const issueChange = calculateChange(totalIssues, prevMonthIssues);

    // Get monthly growth data for the last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const users = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });
      const resources = await Resource.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });

      monthlyData.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        users,
        resources
      });
    }

    // Get content distribution
    const tutorials = await require("../models/Tutorial").countDocuments();
    const resources = await Resource.countDocuments();
    const discussions = await Discussion.countDocuments();
    const issues = await Issue.countDocuments();

    const categoryData = [
      { name: 'Tutorials', value: tutorials, color: '#10B981' }, // Green
      { name: 'Resources', value: resources, color: '#F59E0B' }, // Yellow
      { name: 'Discussions', value: discussions, color: '#3B82F6' }, // Blue
      { name: 'Issues', value: issues, color: '#EF4444' } // Red
    ];

    // Get recent activities (last 5 activities across different models)
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(2)
      .select('name email createdAt');

    const recentResources = await Resource.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .populate('createdBy', 'name email')
      .select('title createdAt createdBy');

    const recentDiscussions = await Discussion.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .populate('createdBy', 'name email')
      .select('title createdAt createdBy');

    const recentIssues = await Issue.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .populate('createdBy', 'name email')
      .select('title createdAt createdBy');

    const recentActivities = [
      ...recentUsers.map(user => ({
        id: `user-${user._id}`,
        action: 'New user registered',
        user: user.email,
        time: new Date(user.createdAt).toLocaleString(),
        type: 'user'
      })),
      ...recentResources.map(resource => ({
        id: `resource-${resource._id}`,
        action: 'Resource added',
        user: resource.createdBy?.email || 'Unknown',
        time: new Date(resource.createdAt).toLocaleString(),
        type: 'resource'
      })),
      ...recentDiscussions.map(discussion => ({
        id: `discussion-${discussion._id}`,
        action: 'Discussion created',
        user: discussion.createdBy?.email || 'Unknown',
        time: new Date(discussion.createdAt).toLocaleString(),
        type: 'discussion'
      })),
      ...recentIssues.map(issue => ({
        id: `issue-${issue._id}`,
        action: 'Issue reported',
        user: issue.createdBy?.email || 'Unknown',
        time: new Date(issue.createdAt).toLocaleString(),
        type: 'issue'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalUsers: {
          value: totalUsers.toLocaleString(),
          change: userChange,
          changeType: userChange.startsWith('+') ? 'positive' : 'negative'
        },
        totalResources: {
          value: totalResources.toLocaleString(),
          change: resourceChange,
          changeType: resourceChange.startsWith('+') ? 'positive' : 'negative'
        },
        activeDiscussions: {
          value: totalDiscussions.toLocaleString(),
          change: discussionChange,
          changeType: discussionChange.startsWith('+') ? 'positive' : 'negative'
        },
        openIssues: {
          value: totalIssues.toLocaleString(),
          change: issueChange,
          changeType: issueChange.startsWith('+') ? 'positive' : 'negative'
        }
      },
      userGrowthData: monthlyData,
      categoryData,
      recentActivities
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublicStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalResources = await Resource.countDocuments();

    res.json({
      success: true,
      totalUsers: totalUsers.toLocaleString(),
      totalResources: totalResources.toLocaleString()
    });
  } catch (error) {
    console.error('Public stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const Tutorial = require("../models/Tutorial");
    const Discussion = require("../models/Discussion");
    const Issue = require("../models/Issue");
    const FeatureSuggestion = require("../models/FeatureSuggestion");
    const DocImprovement = require("../models/DocImprovement");
    const ContentReport = require("../models/ContentReport");

    // Get all users with role 'user' only
    const users = await User.find({ role: 'user' }).select('-password');

    // Calculate stats for each user in parallel
    const leaderboardPromises = users.map(async (user) => {
      const userId = user._id;

      // Get all contribution counts in parallel
      const [
        resourcesCount,
        tutorialsCount,
        issuesCount,
        featureSuggestionsCount,
        docImprovementsCount,
        discussionsCount,
        contentReportsCount
      ] = await Promise.all([
        Resource.countDocuments({ createdBy: userId }),
        Tutorial.countDocuments({ createdBy: userId }),
        Issue.countDocuments({ createdBy: userId }),
        FeatureSuggestion.countDocuments({ createdBy: userId }),
        DocImprovement.countDocuments({ createdBy: userId }),
        Discussion.countDocuments({ createdBy: userId }),
        ContentReport.countDocuments({ createdBy: userId })
      ]);

      // Calculate total contributions
      const totalContributions = resourcesCount + tutorialsCount + issuesCount +
                                featureSuggestionsCount + docImprovementsCount +
                                discussionsCount + contentReportsCount;

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        stats: {
          resources: resourcesCount,
          tutorials: tutorialsCount,
          issues: issuesCount,
          featureSuggestions: featureSuggestionsCount,
          docImprovements: docImprovementsCount,
          discussions: discussionsCount,
          contentReports: contentReportsCount,
          totalContributions
        }
      };
    });

    // Wait for all calculations to complete
    const leaderboard = await Promise.all(leaderboardPromises);

    // Sort by total contributions descending
    leaderboard.sort((a, b) => b.stats.totalContributions - a.stats.totalContributions);

    res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnalyticsData = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    const Discussion = require("../models/Discussion");
    const Issue = require("../models/Issue");
    const FeatureSuggestion = require("../models/FeatureSuggestion");
    const DocImprovement = require("../models/DocImprovement");
    const ContentReport = require("../models/ContentReport");
    const Tutorial = require("../models/Tutorial");

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Key Performance Indicators
    const totalUsers = await User.countDocuments({ role: 'user', createdAt: { $gte: startDate } });
    const totalResources = await Resource.countDocuments({ createdAt: { $gte: startDate } });
    const totalDiscussions = await Discussion.countDocuments({ createdAt: { $gte: startDate } });
    const totalIssues = await Issue.countDocuments({ createdAt: { $gte: startDate } });

    // Previous period for comparison
    const prevPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const prevTotalUsers = await User.countDocuments({ role: 'user', createdAt: { $gte: prevPeriodStart, $lt: startDate } });
    const prevTotalResources = await Resource.countDocuments({ createdAt: { $gte: prevPeriodStart, $lt: startDate } });
    const prevTotalDiscussions = await Discussion.countDocuments({ createdAt: { $gte: prevPeriodStart, $lt: startDate } });
    const prevTotalIssues = await Issue.countDocuments({ createdAt: { $gte: prevPeriodStart, $lt: startDate } });

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // Calculate average session duration (mock calculation based on activity)
    const avgSessionDuration = Math.round((4.2 + Math.random() * 1.5) * 10) / 10; // 4.2-5.7 minutes
    const prevAvgSessionDuration = Math.round((3.8 + Math.random() * 1.2) * 10) / 10;

    const kpis = [
      {
        title: 'Total Users',
        value: totalUsers,
        change: calculateChange(totalUsers, prevTotalUsers),
        icon: 'Users'
      },
      {
        title: 'Active Sessions',
        value: Math.round(totalUsers * 0.7), // Estimate active sessions
        change: calculateChange(Math.round(totalUsers * 0.7), Math.round(prevTotalUsers * 0.7)),
        icon: 'Activity'
      },
      {
        title: 'Avg. Engagement',
        value: avgSessionDuration,
        change: calculateChange(avgSessionDuration, prevAvgSessionDuration),
        icon: 'Clock4'
      },
      {
        title: 'Conversion Rate',
        value: 3.8,
        change: 15.7,
        icon: 'Target'
      }
    ];

    // Engagement Trends (daily data for the period)
    const engagementTrends = [];
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const activeUsers = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: dayStart, $lt: dayEnd }
      });

      const discussions = await Discussion.countDocuments({
        createdAt: { $gte: dayStart, $lt: dayEnd }
      });

      const engagementRate = activeUsers > 0 ? (discussions / activeUsers) * 100 : 0;
      const sessionDuration = Math.round((4.0 + Math.random() * 1.5) * 10) / 10; // 4.0-5.5 minutes
      const bounceRate = Math.round((25 + Math.random() * 20) * 10) / 10; // 25-45%
      const conversions = Math.round(activeUsers * 0.05); // 5% conversion rate

      engagementTrends.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        activeUsers,
        engagementRate: Math.round(engagementRate * 10) / 10,
        sessionDuration,
        bounceRate,
        conversions
      });
    }

    // Content Performance
    const tutorials = await Tutorial.find({ createdAt: { $gte: startDate } }).select('views likes');
    const resources = await Resource.find({ createdAt: { $gte: startDate } }).select('views likes');
    const discussions = await Discussion.find({ createdAt: { $gte: startDate } }).select('views likes');

    const contentPerformance = [
      {
        type: 'Articles',
        views: tutorials.reduce((sum, item) => sum + (item.views || 0), 0),
        likes: tutorials.reduce((sum, item) => sum + (item.likes || 0), 0),
        shares: Math.round(tutorials.reduce((sum, item) => sum + (item.likes || 0), 0) * 0.3),
        engagement: tutorials.length > 0 ? Math.round((tutorials.reduce((sum, item) => sum + (item.likes || 0), 0) / tutorials.length) * 10) / 10 : 0
      },
      {
        type: 'Videos',
        views: Math.round(resources.reduce((sum, item) => sum + (item.views || 0), 0) * 1.2),
        likes: Math.round(resources.reduce((sum, item) => sum + (item.likes || 0), 0) * 1.5),
        shares: Math.round(resources.reduce((sum, item) => sum + (item.likes || 0), 0) * 0.4),
        engagement: resources.length > 0 ? Math.round((resources.reduce((sum, item) => sum + (item.likes || 0), 0) / resources.length) * 1.8 * 10) / 10 : 0
      },
      {
        type: 'Tutorials',
        views: Math.round(discussions.reduce((sum, item) => sum + (item.views || 0), 0) * 0.8),
        likes: Math.round(discussions.reduce((sum, item) => sum + (item.likes || 0), 0) * 0.6),
        shares: Math.round(discussions.reduce((sum, item) => sum + (item.likes || 0), 0) * 0.2),
        engagement: discussions.length > 0 ? Math.round((discussions.reduce((sum, item) => sum + (item.likes || 0), 0) / discussions.length) * 0.8 * 10) / 10 : 0
      },
      {
        type: 'News',
        views: Math.round(totalDiscussions * 2.5),
        likes: Math.round(totalDiscussions * 0.8),
        shares: Math.round(totalDiscussions * 0.3),
        engagement: totalDiscussions > 0 ? Math.round((totalDiscussions * 0.8 / totalDiscussions) * 10) / 10 : 0
      },
      {
        type: 'Updates',
        views: Math.round(totalResources * 1.8),
        likes: Math.round(totalResources * 0.5),
        shares: Math.round(totalResources * 0.15),
        engagement: totalResources > 0 ? Math.round((totalResources * 0.5 / totalResources) * 10) / 10 : 0
      }
    ];

    // Traffic Sources with colors
    const trafficSources = [
      { name: 'Organic Search', value: 45, color: '#3B82F6' },
      { name: 'Direct', value: 25, color: '#10B981' },
      { name: 'Social Media', value: 15, color: '#F59E0B' },
      { name: 'Referral', value: 10, color: '#EF4444' },
      { name: 'Email', value: 5, color: '#8B5CF6' }
    ];

    // Conversion Funnel
    const totalVisitors = totalUsers * 4;
    const signUps = totalUsers;
    const engagedUsers = Math.round(totalUsers * 0.65);
    const activeUsers = Math.round(totalUsers * 0.5);
    const payingCustomers = Math.round(totalUsers * 0.038);

    const conversionFunnel = [
      { name: 'Visitors', count: totalVisitors, percentage: 100 },
      { name: 'Engaged Users', count: engagedUsers, percentage: Math.round((engagedUsers / totalVisitors) * 100) },
      { name: 'Sign Ups', count: signUps, percentage: Math.round((signUps / totalVisitors) * 100) },
      { name: 'Active Users', count: activeUsers, percentage: Math.round((activeUsers / totalVisitors) * 100) },
      { name: 'Paying Customers', count: payingCustomers, percentage: Math.round((payingCustomers / totalVisitors) * 100) }
    ];

    // Detailed Metrics
    const pageViews = totalUsers * 5;
    const prevPageViews = prevTotalUsers * 5;
    const uniqueVisitors = Math.round(totalUsers * 0.8);
    const prevUniqueVisitors = Math.round(prevTotalUsers * 0.8);
    const avgSessionDurationSeconds = Math.round(avgSessionDuration * 60); // Convert to seconds
    const prevAvgSessionDurationSeconds = Math.round(prevAvgSessionDuration * 60);
    const bounceRate = 32.1;
    const prevBounceRate = 35.6;
    const conversionRate = 3.8;
    const prevConversionRate = 3.3;
    const revenue = totalUsers * 12; // Mock revenue calculation
    const prevRevenue = prevTotalUsers * 12;

    const detailedMetrics = [
      {
        name: 'Page Views',
        current: pageViews,
        previous: prevPageViews,
        change: calculateChange(pageViews, prevPageViews)
      },
      {
        name: 'Unique Visitors',
        current: uniqueVisitors,
        previous: prevUniqueVisitors,
        change: calculateChange(uniqueVisitors, prevUniqueVisitors)
      },
      {
        name: 'Avg. Session Duration',
        current: avgSessionDurationSeconds / 60, // Convert back to minutes for display
        previous: prevAvgSessionDurationSeconds / 60,
        change: calculateChange(avgSessionDurationSeconds, prevAvgSessionDurationSeconds)
      },
      {
        name: 'Bounce Rate',
        current: bounceRate,
        previous: prevBounceRate,
        change: calculateChange(bounceRate, prevBounceRate)
      },
      {
        name: 'Conversion Rate',
        current: conversionRate,
        previous: prevConversionRate,
        change: calculateChange(conversionRate, prevConversionRate)
      },
      {
        name: 'Revenue',
        current: revenue,
        previous: prevRevenue,
        change: calculateChange(revenue, prevRevenue)
      }
    ];

    res.json({
      success: true,
      data: {
        kpis,
        engagementTrends,
        contentPerformance,
        trafficSources,
        conversionFunnel,
        detailedMetrics
      }
    });
  } catch (error) {
    console.error('Analytics data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
