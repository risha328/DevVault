import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  User, 
  Send, 
  Loader2, 
  ThumbsUp, 
  Flag, 
  MoreVertical, 
  Eye,
  CheckCircle2,
  MapPin,
  Share,
  Bookmark
} from 'lucide-react';

const DiscussionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [activeReplyMenu, setActiveReplyMenu] = useState(null);

  useEffect(() => {
    fetchDiscussion();
    fetchReplies();
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5300/api/discussions/${id}`);
      const data = await response.json();

      if (data.success) {
        setDiscussion(data.data);
      } else {
        setError('Discussion not found');
      }
    } catch (err) {
      setError('Failed to load discussion');
      console.error('Error fetching discussion:', err);
    }
  };

  const fetchReplies = async () => {
    try {
      const response = await fetch(`http://localhost:5300/api/discussions/${id}/replies`);
      const data = await response.json();

      if (data.success) {
        setReplies(data.data);
      }
    } catch (err) {
      console.error('Error fetching replies:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'React': 'bg-blue-100 text-blue-700 border-blue-200',
      'DevOps': 'bg-green-100 text-green-700 border-green-200',
      'TypeScript': 'bg-purple-100 text-purple-700 border-purple-200',
      'Architecture': 'bg-orange-100 text-orange-700 border-orange-200',
      'JavaScript': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Node.js': 'bg-green-100 text-green-700 border-green-200',
      'Database': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!newReply.trim()) return;

    setSubmittingReply(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please sign in to reply');
        setSubmittingReply(false);
        return;
      }

      const response = await fetch(`http://localhost:5300/api/discussions/${id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newReply })
      });

      const data = await response.json();

      if (data.success) {
        setReplies(prev => [...prev, data.data]);
        setNewReply('');
        setDiscussion(prev => ({ 
          ...prev, 
          replies: prev.replies + 1,
          lastActivity: new Date().toISOString()
        }));
      } else {
        setError(data.message || 'Failed to post reply');
      }
    } catch (err) {
      setError('Failed to post reply. Please try again.');
      console.error('Error posting reply:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLike = async (replyId) => {
    // Implement like functionality
    console.log('Like reply:', replyId);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: discussion.title,
          text: discussion.content.substring(0, 100),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
      alert('Link copied to clipboard!');
    }
  };

  const handleBookmark = async () => {
    // Implement bookmark functionality
    console.log('Bookmark discussion');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-sm"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Discussion</h2>
          <p className="text-gray-600">Fetching the latest conversation...</p>
        </div>
      </div>
    );
  }

  if (error && !discussion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Discussion Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={() => navigate('/discussions')}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              Browse Discussions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back to Discussions</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmark}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all duration-200"
            >
              <Bookmark className="w-4 h-4" />
              <span className="text-sm font-medium">Save</span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all duration-200"
            >
              <Share className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Discussion Content - Main Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Discussion Card */}
            {discussion && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
                {/* Discussion Header */}
                <div className="p-8 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getCategoryColor(discussion.category)}`}>
                        {discussion.category}
                      </span>
                      {discussion.isPinned && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <MapPin className="w-4 h-4" />
                          Pinned
                        </span>
                      )}
                      {discussion.isSolved && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-4 h-4" />
                          Solved
                        </span>
                      )}
                    </div>
                  </div>

                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                    {discussion.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {discussion.createdBy?.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{discussion.createdBy?.name || 'Anonymous'}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(discussion.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium">{discussion.replies} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{discussion.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discussion Body */}
                <div className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                      {discussion.content}
                    </div>
                  </div>

                  {/* Discussion Tags */}
                  {discussion.tags && discussion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                      {discussion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Replies Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Replies Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Community Replies
                    <span className="ml-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {replies.length}
                    </span>
                  </h2>
                  <div className="text-sm text-gray-500">
                    Sorted by: <span className="font-medium text-gray-700">Most Helpful</span>
                  </div>
                </div>
              </div>

              {/* Replies List */}
              <div className="divide-y divide-gray-100">
                {replies.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No replies yet</h3>
                    <p className="text-gray-600 mb-2">Be the first to share your expertise!</p>
                    <p className="text-sm text-gray-500">Help the community by providing your insights.</p>
                  </div>
                ) : (
                  replies.map((reply) => (
                    <div 
                      key={reply._id} 
                      className="p-6 hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-4">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {reply.createdBy?.name?.charAt(0) || 'U'}
                          </div>
                        </div>

                        {/* Reply Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 text-sm">
                                {reply.createdBy?.name || 'Anonymous User'}
                              </span>
                              {reply.isExpert && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                                  Expert
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(reply.createdAt)}</span>
                            </div>
                          </div>

                          <div className="prose prose-gray max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                              {reply.content}
                            </div>
                          </div>

                          {/* Reply Actions */}
                          <div className="flex items-center gap-4 mt-4">
                            <button 
                              onClick={() => handleLike(reply._id)}
                              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-all duration-200 group/like"
                            >
                              <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover/like:bg-blue-50 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                              </div>
                              <span>Helpful</span>
                              {reply.likes > 0 && (
                                <span className="text-blue-600 font-medium">{reply.likes}</span>
                              )}
                            </button>
                            <button className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-all duration-200 group/report">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover/report:bg-red-50 transition-colors">
                                <Flag className="w-4 h-4" />
                              </div>
                              <span>Report</span>
                            </button>
                          </div>
                        </div>

                        {/* Reply Menu */}
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="relative">
                            <button 
                              onClick={() => setActiveReplyMenu(activeReplyMenu === reply._id ? null : reply._id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {activeReplyMenu === reply._id && (
                              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                  Copy Link
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                  Edit
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Reply Form */}
              <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <form onSubmit={handleReplySubmit}>
                  <div className="mb-4">
                    <label htmlFor="reply" className="block text-sm font-semibold text-gray-900 mb-3">
                      Share Your Expertise
                    </label>
                    <textarea
                      id="reply"
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Provide a helpful answer, share your experience, or ask for clarification. Be specific and constructive..."
                      rows={5}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical shadow-sm hover:shadow-md focus:shadow-lg"
                      required
                    />
                  </div>

                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Markdown formatting is supported
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReply || !newReply.trim()}
                      className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
                    >
                      {submittingReply ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Posting Reply...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Post Reply
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Discussion Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Replies</span>
                  <span className="font-semibold text-gray-900">{replies.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Views</span>
                  <span className="font-semibold text-gray-900">{discussion?.views || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Activity</span>
                  <span className="text-sm font-medium text-gray-900">
                    {discussion && formatTimeAgo(discussion.lastActivity)}
                  </span>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Be respectful and constructive</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Provide detailed, helpful answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Share code examples when relevant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Mark solutions as answered</span>
                </li>
              </ul>
            </div>

            {/* Related Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                  Subscribe to updates
                </button>
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                  Share with team
                </button>
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                  Export discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetailPage;