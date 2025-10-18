// API Service - Centralized API calls
const API_BASE_URL = 'http://localhost:5300/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// Auth APIs
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Resources APIs
export const resourcesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/resources`);
    return handleResponse(response);
  },

  create: async (resourceData) => {
    const response = await fetch(`${API_BASE_URL}/resources`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resourceData),
    });
    return handleResponse(response);
  },
};

// Tutorials APIs
export const tutorialsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/tutorials`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tutorials/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (tutorialData) => {
    const response = await fetch(`${API_BASE_URL}/tutorials`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tutorialData),
    });
    return handleResponse(response);
  },

  like: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tutorials/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Categories APIs
export const categoriesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse(response);
  },
};

// Bookmarks APIs
export const bookmarksAPI = {
  getUserBookmarks: async () => {
    const response = await fetch(`${API_BASE_URL}/bookmark/user/bookmarks`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  toggleBookmark: async (itemType, itemId) => {
    const response = await fetch(`${API_BASE_URL}/bookmark/${itemType}/${itemId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Discussions APIs
export const discussionsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}/discussions?${queryString}` : `${API_BASE_URL}/discussions`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/discussions/${id}`);
    return handleResponse(response);
  },

  getReplies: async (id) => {
    const response = await fetch(`${API_BASE_URL}/discussions/${id}/replies`);
    return handleResponse(response);
  },

  create: async (discussionData) => {
    const response = await fetch(`${API_BASE_URL}/discussions`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discussionData),
    });
    return handleResponse(response);
  },

  createReply: async (id, replyData) => {
    const response = await fetch(`${API_BASE_URL}/discussions/${id}/replies`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(replyData),
    });
    return handleResponse(response);
  },
};

// Feature Suggestions APIs
export const featureSuggestionsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/feature-suggestions`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/feature-suggestions/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (suggestionData) => {
    const response = await fetch(`${API_BASE_URL}/feature-suggestions`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(suggestionData),
    });
    return handleResponse(response);
  },
};

// Content Reports APIs
export const contentReportsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/content-reports`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/content-reports/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (reportData) => {
    const response = await fetch(`${API_BASE_URL}/content-reports`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    return handleResponse(response);
  },

  updateStatus: async (id, statusData) => {
    const response = await fetch(`${API_BASE_URL}/content-reports/${id}/status`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData),
    });
    return handleResponse(response);
  },
};

// Issues APIs
export const issuesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/issues`);
    return handleResponse(response);
  },

  create: async (issueData) => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issueData),
    });
    return handleResponse(response);
  },
};

// Doc Improvements APIs
export const docImprovementsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/doc-improvements`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/doc-improvements/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (improvementData) => {
    const response = await fetch(`${API_BASE_URL}/doc-improvements`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(improvementData),
    });
    return handleResponse(response);
  },
};
