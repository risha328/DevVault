import { Link } from 'react-router-dom';
import { MessageSquare, Clock, User, ArrowRight } from 'lucide-react';

const RecentDiscussions = () => {
  const recentDiscussions = [
    {
      id: 1,
      title: 'Best practices for React state management in 2024',
      author: 'Emma Wilson',
      replies: 23,
      timeAgo: '2 hours ago',
      category: 'React',
      views: 142,
      isPinned: true,
      isSolved: false
    },
    {
      id: 2,
      title: 'How to optimize Docker images for production environments',
      author: 'David Kim',
      replies: 15,
      timeAgo: '4 hours ago',
      category: 'DevOps',
      views: 98,
      isPinned: false,
      isSolved: true
    },
    {
      id: 3,
      title: 'TypeScript vs JavaScript: When to choose what for enterprise applications',
      author: 'Lisa Park',
      replies: 31,
      timeAgo: '6 hours ago',
      category: 'TypeScript',
      views: 215,
      isPinned: true,
      isSolved: false
    },
    {
      id: 4,
      title: 'Implementing microservices architecture with Node.js and Kubernetes',
      author: 'Alex Chen',
      replies: 42,
      timeAgo: '1 day ago',
      category: 'Architecture',
      views: 187,
      isPinned: false,
      isSolved: true
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'React': 'bg-blue-100 text-blue-800',
      'DevOps': 'bg-green-100 text-green-800',
      'TypeScript': 'bg-purple-100 text-purple-800',
      'Architecture': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            Community Forum
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Recent Discussions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join technical conversations with industry experts and fellow developers. 
            Share knowledge, solve challenges, and stay updated with the latest trends.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-between mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{recentDiscussions.length}+</div>
                <div className="text-sm text-gray-600">Active Topics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {recentDiscussions.reduce((sum, discussion) => sum + discussion.replies, 0)}+
                </div>
                <div className="text-sm text-gray-600">Total Replies</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Latest Activity</option>
                <option>Most Replies</option>
                <option>Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Discussions List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {recentDiscussions.map((discussion, index) => (
              <div 
                key={discussion.id} 
                className={`p-6 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                  discussion.isPinned ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Discussion Status */}
                  <div className="flex flex-col items-center gap-2 min-w-12">
                    {discussion.isPinned && (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">📌</span>
                      </div>
                    )}
                    {discussion.isSolved && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Discussion Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(discussion.category)}`}>
                        {discussion.category}
                      </span>
                      {discussion.isPinned && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Pinned
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {discussion.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{discussion.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{discussion.timeAgo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{discussion.replies} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👁️</span>
                        <span>{discussion.views} views</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col items-end gap-2">
                    <Link
                      to={`/discussions/${discussion.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      View Discussion
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Join the Conversation?
              </h3>
              <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
                Connect with developers worldwide, share your expertise, and get answers to your technical questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/discussions"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <MessageSquare className="w-5 h-5" />
                  Browse All Discussions
                </Link>
                <Link
                  to="/discussions/new"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
                >
                  Start New Discussion
                </Link>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Expert Community</h4>
                <p className="text-gray-600 text-sm">Get answers from experienced developers and industry professionals</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Latest Trends</h4>
                <p className="text-gray-600 text-sm">Stay updated with cutting-edge technologies and best practices</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Networking</h4>
                <p className="text-gray-600 text-sm">Connect with peers and expand your professional network</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentDiscussions;