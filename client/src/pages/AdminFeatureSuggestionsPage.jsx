// import { useState, useEffect } from 'react';
// import AdminLayout from '../components/admin/AdminLayout';
// import { featureSuggestionsAPI } from '../api/apiService';

// const AdminFeatureSuggestionsPage = () => {
//   const [suggestions, setSuggestions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showApproveModal, setShowApproveModal] = useState(false);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [selectedSuggestion, setSelectedSuggestion] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Fetch suggestions on component mount
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       try {
//         setIsLoading(true);
//         setError('');

//         const response = await featureSuggestionsAPI.getAll();
//         setSuggestions(response.data || []);
//       } catch (err) {
//         setError('Unable to load feature suggestions. Please try again later.');
//         console.error('Fetch error:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchSuggestions();
//   }, []);

//   // Filter suggestions based on status and search term
//   const filteredSuggestions = suggestions.filter(suggestion => {
//     const matchesFilter = filter === 'all' || suggestion.status === filter;
//     const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   const handleApproveClick = (suggestion) => {
//     setSelectedSuggestion(suggestion);
//     setShowApproveModal(true);
//   };

//   const handleRejectClick = (suggestion) => {
//     setSelectedSuggestion(suggestion);
//     setShowRejectModal(true);
//   };

//   const handleApproveConfirm = async () => {
//     if (!selectedSuggestion) return;

//     try {
//       setIsProcessing(true);
//       await featureSuggestionsAPI.updateStatus(selectedSuggestion._id, 'approved');
//       // Update the local state
//       setSuggestions(suggestions.map(suggestion =>
//         suggestion._id === selectedSuggestion._id
//           ? { ...suggestion, status: 'approved', approvedAt: new Date() }
//           : suggestion
//       ));
//       setShowApproveModal(false);
//       setSelectedSuggestion(null);
//     } catch (err) {
//       setError('Failed to approve suggestion. Please try again.');
//       console.error('Approve error:', err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleRejectConfirm = async () => {
//     if (!selectedSuggestion) return;

//     try {
//       setIsProcessing(true);
//       await featureSuggestionsAPI.updateStatus(selectedSuggestion._id, 'rejected');
//       // Update the local state
//       setSuggestions(suggestions.map(suggestion =>
//         suggestion._id === selectedSuggestion._id
//           ? { ...suggestion, status: 'rejected', rejectedAt: new Date() }
//           : suggestion
//       ));
//       setShowRejectModal(false);
//       setSelectedSuggestion(null);
//     } catch (err) {
//       setError('Failed to reject suggestion. Please try again.');
//       console.error('Reject error:', err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleApproveCancel = () => {
//     setShowApproveModal(false);
//     setSelectedSuggestion(null);
//   };

//   const handleRejectCancel = () => {
//     setShowRejectModal(false);
//     setSelectedSuggestion(null);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'approved': return 'bg-green-100 text-green-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'low': return 'bg-blue-100 text-blue-800';
//       case 'medium': return 'bg-green-100 text-green-800';
//       case 'high': return 'bg-orange-100 text-orange-800';
//       case 'game-changer': return 'bg-purple-100 text-purple-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'ui-ux': return '🎨';
//       case 'functionality': return '⚙️';
//       case 'performance': return '⚡';
//       case 'mobile': return '📱';
//       case 'integration': return '🔗';
//       case 'content': return '📝';
//       case 'social': return '👥';
//       case 'other': return '💡';
//       default: return '💡';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Loading skeleton component
//   const LoadingSkeleton = () => (
//     <AdminLayout>
//       <div className="space-y-6">
//         <div className="text-center mb-12">
//           <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
//           <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
//         </div>
//         <div className="space-y-6">
//           {[...Array(5)].map((_, index) => (
//             <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex-1">
//                   <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                 </div>
//                 <div className="h-6 bg-gray-200 rounded w-20"></div>
//               </div>
//               <div className="space-y-2">
//                 <div className="h-4 bg-gray-200 rounded"></div>
//                 <div className="h-4 bg-gray-200 rounded w-5/6"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </AdminLayout>
//   );

//   if (isLoading) {
//     return <LoadingSkeleton />;
//   }

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         {/* Header Section */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Feature Suggestions Management
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
//             Review and manage feature suggestions from users. Approve suggestions to make them visible on the website.
//           </p>

//           {/* Search and Filter Controls */}
//           <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
//             {/* Search Bar */}
//             <div className="relative max-w-md">
//               <input
//                 type="text"
//                 placeholder="Search suggestions..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               />
//               <div className="absolute inset-y-0 left-0 flex items-center pl-4">
//                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//             </div>

//             {/* Status Filter */}
//             <div className="flex gap-2">
//               {['all', 'pending', 'approved', 'rejected'].map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => setFilter(status)}
//                   className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                     filter === status
//                       ? 'bg-blue-600 text-white shadow-lg'
//                       : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                   }`}
//                 >
//                   {status === 'all' ? 'All Suggestions' : status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
//             <div className="flex items-center space-x-2 text-red-700">
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//               <span>{error}</span>
//             </div>
//           </div>
//         )}

//         {/* Suggestions List */}
//         {filteredSuggestions.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
//             <div className="text-gray-300 text-6xl mb-4">
//               {searchTerm || filter !== 'all' ? '🔍' : '💡'}
//             </div>
//             <h3 className="text-2xl font-semibold text-gray-600 mb-3">
//               {searchTerm || filter !== 'all' ? 'No matching suggestions found' : 'No suggestions submitted yet'}
//             </h3>
//             <p className="text-gray-500 max-w-md mx-auto">
//               {searchTerm || filter !== 'all'
//                 ? 'Try adjusting your search terms or filter settings.'
//                 : 'Suggestions will appear here once they are submitted by users.'
//               }
//             </p>
//             {(searchTerm || filter !== 'all') && (
//               <button
//                 onClick={() => {
//                   setSearchTerm('');
//                   setFilter('all');
//                 }}
//                 className="mt-4 px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Results Count */}
//             <div className="flex justify-between items-center mb-6">
//               <p className="text-gray-600">
//                 Showing <span className="font-semibold">{filteredSuggestions.length}</span> of{' '}
//                 <span className="font-semibold">{suggestions.length}</span> suggestions
//               </p>
//             </div>

//             {/* Suggestions Grid */}
//             <div className="space-y-6">
//               {filteredSuggestions.map((suggestion) => (
//                 <div
//                   key={suggestion._id}
//                   className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
//                 >
//                   <div className="p-6">
//                     {/* Suggestion Header */}
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <span className="text-2xl">{getCategoryIcon(suggestion.category)}</span>
//                           <h3 className="text-xl font-bold text-gray-900">
//                             {suggestion.title}
//                           </h3>
//                         </div>
//                         <div className="flex items-center gap-4 text-sm text-gray-600">
//                           <span>Submitted by: {suggestion.createdBy?.name || 'Anonymous'}</span>
//                           <span>•</span>
//                           <span>{formatDate(suggestion.createdAt)}</span>
//                         </div>
//                       </div>
//                       <div className="flex flex-col gap-2">
//                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(suggestion.status)}`}>
//                           {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
//                         </span>
//                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(suggestion.priority)}`}>
//                           {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1).replace('-', ' ')}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Suggestion Description */}
//                     <div className="mb-4">
//                       <p className="text-gray-700 line-clamp-3">{suggestion.description}</p>
//                     </div>

//                     {/* Use Case */}
//                     <div className="mb-4">
//                       <h4 className="font-semibold text-gray-900 mb-2">Problem Solved:</h4>
//                       <p className="text-gray-700">{suggestion.useCase}</p>
//                     </div>

//                     {/* Benefits */}
//                     {suggestion.benefits && (
//                       <div className="mb-4">
//                         <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
//                         <p className="text-gray-700">{suggestion.benefits}</p>
//                       </div>
//                     )}

//                     {/* Contact Info */}
//                     {suggestion.contactEmail && (
//                       <div className="mb-4">
//                         <h4 className="font-semibold text-gray-900 mb-2">Contact:</h4>
//                         <p className="text-gray-700">{suggestion.contactEmail}</p>
//                       </div>
//                     )}

//                     {/* Approval Section */}
//                     {suggestion.status === 'pending' && (
//                       <div className="flex justify-end gap-3">
//                         <button
//                           onClick={() => handleRejectClick(suggestion)}
//                           className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
//                         >
//                           Reject
//                         </button>
//                         <button
//                           onClick={() => handleApproveClick(suggestion)}
//                           className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
//                         >
//                           Approve
//                         </button>
//                       </div>
//                     )}

//                     {/* Approved/Rejected Info */}
//                     {(suggestion.status === 'approved' || suggestion.status === 'rejected') && (
//                       <div className="text-sm text-gray-600">
//                         {suggestion.status === 'approved' ? 'Approved' : 'Rejected'} on: {formatDate(suggestion.approvedAt || suggestion.rejectedAt)}
//                       </div>
//                     )}

//                     {/* Additional Details (Expandable) */}
//                     {suggestion.alternatives && (
//                       <div className="mt-4 pt-4 border-t border-gray-200">
//                         <details className="group">
//                           <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
//                             <svg className="w-4 h-4 transform group-open:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                             </svg>
//                             View alternatives considered
//                           </summary>
//                           <div className="mt-3">
//                             <p className="text-gray-700">{suggestion.alternatives}</p>
//                           </div>
//                         </details>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {/* Approve Confirmation Modal */}
//         {showApproveModal && selectedSuggestion && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//               <div className="flex items-center mb-4">
//                 <div className="flex-shrink-0">
//                   <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Approve Feature Suggestion
//                   </h3>
//                 </div>
//               </div>
//               <div className="mb-6">
//                 <p className="text-sm text-gray-600">
//                   Are you sure you want to approve this feature suggestion? Once approved, it will be visible to all users on the website.
//                 </p>
//                 <div className="mt-3 p-3 bg-gray-50 rounded-md">
//                   <p className="text-sm font-medium text-gray-900">{selectedSuggestion.title}</p>
//                   <p className="text-sm text-gray-600 mt-1 line-clamp-2">{selectedSuggestion.description}</p>
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={handleApproveCancel}
//                   disabled={isProcessing}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleApproveConfirm}
//                   disabled={isProcessing}
//                   className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
//                 >
//                   {isProcessing ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Approving...
//                     </>
//                   ) : (
//                     'Yes, Approve'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Reject Confirmation Modal */}
//         {showRejectModal && selectedSuggestion && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//               <div className="flex items-center mb-4">
//                 <div className="flex-shrink-0">
//                   <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Reject Feature Suggestion
//                   </h3>
//                 </div>
//               </div>
//               <div className="mb-6">
//                 <p className="text-sm text-gray-600">
//                   Are you sure you want to reject this feature suggestion? This action cannot be undone.
//                 </p>
//                 <div className="mt-3 p-3 bg-gray-50 rounded-md">
//                   <p className="text-sm font-medium text-gray-900">{selectedSuggestion.title}</p>
//                   <p className="text-sm text-gray-600 mt-1 line-clamp-2">{selectedSuggestion.description}</p>
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={handleRejectCancel}
//                   disabled={isProcessing}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleRejectConfirm}
//                   disabled={isProcessing}
//                   className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
//                 >
//                   {isProcessing ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Rejecting...
//                     </>
//                   ) : (
//                     'Yes, Reject'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminFeatureSuggestionsPage;


import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { featureSuggestionsAPI } from '../api/apiService';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  Mail,
  ArrowUpDown
} from 'lucide-react';

const AdminFeatureSuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Fetch suggestions on component mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await featureSuggestionsAPI.getAll();
        setSuggestions(response.data || []);
      } catch (err) {
        setError('Unable to load feature suggestions. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Filter and sort suggestions
  const filteredAndSortedSuggestions = suggestions
    .filter(suggestion => {
      const matchesFilter = filter === 'all' || suggestion.status === filter;
      const matchesSearch = suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           suggestion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (suggestion.createdBy?.name && suggestion.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'priority') {
        const priorityOrder = { 'game-changer': 4, 'high': 3, 'medium': 2, 'low': 1 };
        const aPriority = priorityOrder[a.priority] || 0;
        const bPriority = priorityOrder[b.priority] || 0;
        return sortConfig.direction === 'asc' ? aPriority - bPriority : bPriority - aPriority;
      }

      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'createdBy') {
        aValue = a.createdBy?.name || '';
        bValue = b.createdBy?.name || '';
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleRowSelection = (id) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredAndSortedSuggestions.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAndSortedSuggestions.map(s => s._id)));
    }
  };

  const handleApproveClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setShowApproveModal(true);
  };

  const handleRejectClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setShowRejectModal(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedSuggestion) return;

    try {
      setIsProcessing(true);
      await featureSuggestionsAPI.updateStatus(selectedSuggestion._id, 'approved');
      setSuggestions(suggestions.map(suggestion =>
        suggestion._id === selectedSuggestion._id
          ? { ...suggestion, status: 'approved', approvedAt: new Date() }
          : suggestion
      ));
      setShowApproveModal(false);
      setSelectedSuggestion(null);
    } catch (err) {
      setError('Failed to approve suggestion. Please try again.');
      console.error('Approve error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedSuggestion) return;

    try {
      setIsProcessing(true);
      await featureSuggestionsAPI.updateStatus(selectedSuggestion._id, 'rejected');
      setSuggestions(suggestions.map(suggestion =>
        suggestion._id === selectedSuggestion._id
          ? { ...suggestion, status: 'rejected', rejectedAt: new Date() }
          : suggestion
      ));
      setShowRejectModal(false);
      setSelectedSuggestion(null);
    } catch (err) {
      setError('Failed to reject suggestion. Please try again.');
      console.error('Reject error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveCancel = () => {
    setShowApproveModal(false);
    setSelectedSuggestion(null);
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setSelectedSuggestion(null);
  };

  const handleDeleteClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSuggestion) return;

    try {
      setIsProcessing(true);
      await featureSuggestionsAPI.delete(selectedSuggestion._id);
      setSuggestions(suggestions.filter(suggestion => suggestion._id !== selectedSuggestion._id));
      setShowDeleteModal(false);
      setSelectedSuggestion(null);
    } catch (err) {
      setError('Failed to delete suggestion. Please try again.');
      console.error('Delete error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedSuggestion(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'medium': return 'bg-green-50 text-green-700 border-green-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'game-changer': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'ui-ux': '🎨',
      'functionality': '⚙️',
      'performance': '⚡',
      'mobile': '📱',
      'integration': '🔗',
      'content': '📝',
      'social': '👥',
      'other': '💡'
    };
    return icons[category] || '💡';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          
          <div className="flex gap-4 mb-6">
            <div className="h-12 bg-gray-200 rounded flex-1"></div>
            <div className="h-12 bg-gray-200 rounded w-48"></div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="h-12 bg-gray-100 border-b border-gray-200"></div>
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-16 border-b border-gray-200 flex items-center px-6">
                <div className="flex-1 flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/8"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );

  const SortableHeader = ({ children, sortKey, currentSort }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 group"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
        {currentSort.key === sortKey && (
          currentSort.direction === 'asc' ? 
          <ChevronUp className="h-4 w-4 text-blue-500" /> : 
          <ChevronDown className="h-4 w-4 text-blue-500" />
        )}
      </div>
    </th>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feature Suggestions</h1>
            <p className="text-gray-600 mt-2">
              Manage and review feature suggestions submitted by users
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search suggestions, descriptions, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All', count: suggestions.length },
                { key: 'pending', label: 'Pending', count: suggestions.filter(s => s.status === 'pending').length },
                { key: 'approved', label: 'Approved', count: suggestions.filter(s => s.status === 'approved').length },
                { key: 'rejected', label: 'Rejected', count: suggestions.filter(s => s.status === 'rejected').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    filter === key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    filter === key ? 'bg-blue-500' : 'bg-gray-200'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="text-red-700">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header Stats */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredAndSortedSuggestions.length}</span> of{' '}
                  <span className="font-semibold">{suggestions.length}</span> suggestions
                </span>
                {selectedRows.size > 0 && (
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedRows.size} selected
                  </span>
                )}
              </div>
              {selectedRows.size > 0 && (
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium">
                    Approve Selected
                  </button>
                  <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
                    Reject Selected
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* <th className="w-12 px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === filteredAndSortedSuggestions.length && filteredAndSortedSuggestions.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th> */}
                  <SortableHeader sortKey="title" currentSort={sortConfig}>
                    Feature Title
                  </SortableHeader>
                  <SortableHeader sortKey="createdBy" currentSort={sortConfig}>
                    Submitted By
                  </SortableHeader>
                  <SortableHeader sortKey="category" currentSort={sortConfig}>
                    Category
                  </SortableHeader>
                  <SortableHeader sortKey="priority" currentSort={sortConfig}>
                    Priority
                  </SortableHeader>
                  {/* <SortableHeader sortKey="votes" currentSort={sortConfig}>
                    Votes
                  </SortableHeader> */}
                  <SortableHeader sortKey="status" currentSort={sortConfig}>
                    Status
                  </SortableHeader>
                  <SortableHeader sortKey="createdAt" currentSort={sortConfig}>
                    Submitted
                  </SortableHeader>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedSuggestions.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-24 text-center">
                      <div className="text-gray-400 text-6xl mb-4">
                        {searchTerm || filter !== 'all' ? '🔍' : '💡'}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        {searchTerm || filter !== 'all' ? 'No matching suggestions found' : 'No suggestions submitted yet'}
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        {searchTerm || filter !== 'all'
                          ? 'Try adjusting your search terms or filter settings.'
                          : 'Suggestions will appear here once they are submitted by users.'
                        }
                      </p>
                      {(searchTerm || filter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setFilter('all');
                          }}
                          className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedSuggestions.map((suggestion) => (
                    <React.Fragment key={suggestion._id}>
                      <tr
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedRows.has(suggestion._id) ? 'bg-blue-50' : ''
                        }`}
                      >
                        {/* <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(suggestion._id)}
                            onChange={() => toggleRowSelection(suggestion._id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td> */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleRowExpansion(suggestion._id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {expandedRows.has(suggestion._id) ? 
                                <ChevronUp className="h-4 w-4" /> : 
                                <ChevronDown className="h-4 w-4" />
                              }
                            </button>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                    {suggestion.title}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate max-w-xs">
                                    {suggestion.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {/* <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {suggestion.createdBy?.name || 'Anonymous'}
                            </span>
                          </div> */}
                          {suggestion.contactEmail && (
                            <div className="flex items-center space-x-2 mt-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {suggestion.contactEmail}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {suggestion.category.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)} capitalize`}>
                            {suggestion.priority.replace('-', ' ')}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 font-medium">
                            {suggestion.votes || 0}
                          </span>
                        </td> */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(suggestion.status)}`}>
                            {getStatusIcon(suggestion.status)}
                            <span className="capitalize">{suggestion.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(suggestion.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {suggestion.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveClick(suggestion)}
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectClick(suggestion)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteClick(suggestion)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row Details */}
                      {expandedRows.has(suggestion._id) && (
                        <tr className="bg-gray-50">
                          <td colSpan="9" className="px-6 py-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Problem & Use Case</h4>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{suggestion.useCase}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Benefits</h4>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{suggestion.benefits || 'Not specified'}</p>
                              </div>
                              {suggestion.alternatives && (
                                <div className="lg:col-span-2">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Alternatives Considered</h4>
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{suggestion.alternatives}</p>
                                </div>
                              )}
                              {(suggestion.approvedAt || suggestion.rejectedAt) && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                    {suggestion.status === 'approved' ? 'Approved' : 'Rejected'} Details
                                  </h4>
                                  <p className="text-sm text-gray-700">
                                    {formatDateTime(suggestion.approvedAt || suggestion.rejectedAt)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {/* Approve Confirmation Modal */}
        {showApproveModal && selectedSuggestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Approve Feature Suggestion</h3>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  Are you sure you want to approve this feature suggestion?
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{selectedSuggestion.title}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{selectedSuggestion.description}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleApproveCancel}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveConfirm}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Approving...</span>
                    </>
                  ) : (
                    <span>Approve</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Confirmation Modal */}
        {showRejectModal && selectedSuggestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Reject Feature Suggestion</h3>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  Are you sure you want to reject this feature suggestion? This action cannot be undone.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{selectedSuggestion.title}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{selectedSuggestion.description}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleRejectCancel}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Rejecting...</span>
                    </>
                  ) : (
                    <span>Reject</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedSuggestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Feature Suggestion</h3>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  Are you sure you want to delete this feature suggestion? This action cannot be undone.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{selectedSuggestion.title}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{selectedSuggestion.description}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFeatureSuggestionsPage;