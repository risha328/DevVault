import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import AddResources from './pages/AddResources';
import BrowseResources from './pages/BrowseResources';
import CategoriesPage from './pages/CategoriesPage';
import ContributePage from './pages/ContributePage';
import ReportIssuesPage from './pages/ReportIssuesPage';
import SuggestFeaturesPage from './pages/SuggestFeaturesPage';
import ImproveDocsPage from './pages/ImproveDocsPage';
import ReportContentPage from './pages/ReportContentPage';
import WriteTutorialPage from './pages/WriteTutorialPage';
import TutorialPage from './pages/TutorialPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-resources" element={<AddResources />} />
        <Route path="/browse-resources" element={<BrowseResources />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/contribute" element={<ContributePage />} />
        <Route path="/report-issues" element={<ReportIssuesPage />} />
        <Route path="/suggest-features" element={<SuggestFeaturesPage />} />
        <Route path="/improve-docs" element={<ImproveDocsPage />} />
        <Route path="/report-content" element={<ReportContentPage />} />
        <Route path="/write-tutorial" element={<WriteTutorialPage />} />
        <Route path="/tutorial/:id" element={<TutorialPage />} />
      </Routes>
    </Router>
  );
}

export default App;
