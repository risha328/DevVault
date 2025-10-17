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
      </Routes>
    </Router>
  );
}

export default App;
