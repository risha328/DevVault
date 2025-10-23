import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import FeaturesPage from './pages/FeaturesPage';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import AddResources from './pages/AddResources';
import BrowseResources from './pages/BrowseResources';
import BookmarksPage from './pages/BookmarksPage';
import CategoriesPage from './pages/CategoriesPage';
import ContributePage from './pages/ContributePage';
import ReportIssuesPage from './pages/ReportIssuesPage';
import SuggestFeaturesPage from './pages/SuggestFeaturesPage';
import FeatureSuggestionsPage from './pages/FeatureSuggestionsPage';
import FeatureSuggestionDetailPage from './pages/FeatureSuggestionDetailPage';
import ImproveDocsPage from './pages/ImproveDocsPage';
import AllDocImprovementsPage from './pages/AllDocImprovementsPage';
import ReportContentPage from './pages/ReportContentPage';
import WriteTutorialPage from './pages/WriteTutorialPage';
import TutorialPage from './pages/TutorialPage';
import DocImprovementDetailPage from './pages/DocImprovementDetailPage';
import NewDiscussionPage from './pages/NewDiscussionPage';
import DiscussionDetailPage from './pages/DiscussionDetailPage';
import DiscussionsPage from './pages/DiscussionsPage';
import AllIssuesPage from './pages/AllIssuesPage';
import AllContentReportsPage from './pages/AllContentReportsPage';
import ContentReportDetailPage from './pages/ContentReportDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminResourcesPage from './pages/AdminResourcesPage';
import AdminDiscussionsPage from './pages/AdminDiscussionsPage';
import AdminBookmarksPage from './pages/AdminBookmarksPage';
import AdminFeatureSuggestionsPage from './pages/AdminFeatureSuggestionsPage';
import AdminDocsImprovementsPage from './pages/AdminDocsImprovementsPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminRegister from './pages/AdminRegister';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-resources" element={<AddResources />} />
        <Route path="/browse-resources" element={<BrowseResources />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/contribute" element={<ContributePage />} />
        <Route path="/report-issues" element={<ReportIssuesPage />} />
        <Route path="/suggest-features" element={<SuggestFeaturesPage />} />
        <Route path="/feature-suggestions" element={<FeatureSuggestionsPage />} />
        <Route path="/feature-suggestions/:id" element={<FeatureSuggestionDetailPage />} />
        <Route path="/improve-docs" element={<ImproveDocsPage />} />
        <Route path="/all-doc-improvements" element={<AllDocImprovementsPage />} />
        <Route path="/report-content" element={<ReportContentPage />} />
        <Route path="/write-tutorial" element={<WriteTutorialPage />} />
        <Route path="/tutorial/:id" element={<TutorialPage />} />
        <Route path="/doc-improvements/:id" element={<DocImprovementDetailPage />} />
        <Route path="/discussions/new" element={<NewDiscussionPage />} />
        <Route path="/discussions/:id" element={<DiscussionDetailPage />} />
        <Route path="/discussions" element={<DiscussionsPage />} />
        <Route path="/all-issues" element={<AllIssuesPage />} />
        <Route path="/all-content-reports" element={<AllContentReportsPage />} />
        <Route path="/content-reports/:id" element={<ContentReportDetailPage />} />

        {/* Admin Routes */}
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsersPage /></AdminProtectedRoute>} />
        <Route path="/admin/resources" element={<AdminProtectedRoute><AdminResourcesPage /></AdminProtectedRoute>} />
        <Route path="/admin/discussions" element={<AdminProtectedRoute><AdminDiscussionsPage /></AdminProtectedRoute>} />
        <Route path="/admin/bookmarks" element={<AdminProtectedRoute><AdminBookmarksPage /></AdminProtectedRoute>} />
        <Route path="/admin/feature-suggestions" element={<AdminProtectedRoute><AdminFeatureSuggestionsPage /></AdminProtectedRoute>} />
        <Route path="/admin/docs-improvements" element={<AdminProtectedRoute><AdminDocsImprovementsPage /></AdminProtectedRoute>} />
        <Route path="/admin/reports" element={<AdminProtectedRoute><AdminReportsPage /></AdminProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
