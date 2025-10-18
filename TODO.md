# API Refactoring TODO

## Completed
- [x] Add getById method to docImprovementsAPI in apiService.js
- [x] Refactor TutorialPage.jsx to use tutorialsAPI.getById and tutorialsAPI.like
- [x] Refactor SuggestFeaturesPage.jsx to use featureSuggestionsAPI.create
- [x] Refactor WriteTutorialPage.jsx to use tutorialsAPI.create
- [x] Refactor Signin.jsx to use authAPI.login
- [x] Refactor Signup.jsx to use authAPI.register
- [x] Refactor ReportContentPage.jsx to use contentReportsAPI.create
- [x] Refactor ReportIssuesPage.jsx to use issuesAPI.create
- [x] Refactor NewDiscussionPage.jsx to use discussionsAPI.create
- [x] Refactor ImproveDocsPage.jsx to use docImprovementsAPI.getAll and docImprovementsAPI.create

## Pending
- [x] Refactor FeatureSuggestionsPage.jsx to use featureSuggestionsAPI.getAll
- [x] Refactor FeatureSuggestionDetailPage.jsx to use featureSuggestionsAPI.getById
- [x] Refactor DocImprovementDetailPage.jsx to use docImprovementsAPI.getById
- [x] Refactor DiscussionsPage.jsx to use discussionsAPI.getAll
- [x] Refactor DiscussionDetailPage.jsx to use discussionsAPI.getById and discussionsAPI.getReplies and discussionsAPI.createReply
- [x] Refactor CategoriesPage.jsx to use categoriesAPI.getAll and resourcesAPI.getAll
- [x] Refactor BookmarksPage.jsx to use bookmarksAPI.getUserBookmarks and bookmarksAPI.toggleBookmark
- [x] Refactor AllDocImprovementsPage.jsx to use docImprovementsAPI.getAll
- [x] Refactor RecentDiscussions.jsx to use discussionsAPI.getAll
- [x] Refactor Navbar.jsx to use authAPI.getProfile

## Notes
- Ensure all error handling is consistent with the API service
- Update any missing API methods in apiService.js as needed
- Test each refactored component to ensure functionality remains intact
