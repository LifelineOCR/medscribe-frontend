// src/services/api.js

const API_BASE_URL = 'http://localhost:4000/api'; // Your backend URL

export const getAuthToken = () => localStorage.getItem('medscribeUserToken');
export const setAuthToken = (token) => localStorage.setItem('medscribeUserToken', token);
export const removeAuthToken = () => localStorage.removeItem('medscribeUserToken');

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText || `Request failed: ${response.status}`;
    console.error('API Error:', error, 'Full response data:', data);
    throw new Error(error);
  }
  return data.data;
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await handleResponse(response);
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await handleResponse(response);
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const logoutUser = () => {
  removeAuthToken();
  console.log("User logged out from API service.");
};

export const isLoggedIn = () => !!getAuthToken();

export const uploadDocument = async (file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('document', file);
  for (const key in additionalData) {
    if (additionalData.hasOwnProperty(key)) formData.append(key, additionalData[key]);
  }
  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
    body: formData,
  });
  return handleResponse(response);
};

// Existing function, effectively "getAllRecords" for the current user
export const getUserDocuments = async (filters = {}) => {
  const { status, searchTerm } = filters;
  let queryString = '';
  const queryParams = new URLSearchParams();

  if (status && status !== 'All Status' && status !== '') {
    queryParams.append('status', status);
  }
  if (searchTerm) {
    queryParams.append('searchTerm', searchTerm);
  }

  queryString = queryParams.toString();
  const url = `${API_BASE_URL}/documents${queryString ? `?${queryString}` : ''}`;

  console.log("Fetching documents with URL:", url); // For debugging

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  return handleResponse(response);
};

// New function named getAllRecords - calls the same endpoint as getUserDocuments
/**
 * Fetches all documents for the currently authenticated user.
 * (This is an alias or equivalent to getUserDocuments)
 */
export const getAllRecords = async (filters = {}) => {
  console.log("getAllRecords called with filters:", filters);
  return getUserDocuments(filters); 
};



// Existing function for recent records
export const getRecentUserDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/documents/recent`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// New function named getRecentRecords - calls the same endpoint as getRecentUserDocuments
/**
 * Fetches recent documents for the currently authenticated user.
 * (This is an alias or equivalent to getRecentUserDocuments)
 */
export const getRecentRecords = async () => {
  console.log("Fetching recent records for current user..."); // For debugging
  const response = await fetch(`${API_BASE_URL}/documents/recent`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  console.log(response)
  return handleResponse(response);
};


export const getDocumentById = async (documentId) => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  console.log(response);
  return handleResponse(response);
};

export const getDocumentTranscription = async (documentId) => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}/transcription`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getCurrentUserProfile = async () => {
  // Ensure your backend has a GET /api/auth/me endpoint for this
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
