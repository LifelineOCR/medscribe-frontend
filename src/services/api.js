// src/services/api.js

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockRecentRecords = [
  { id: '1', name: 'PATIENT CHART - DR. SMITH', date: '2024-01-15', doctor: 'DR. SMITH', status: 'COMPLETED' },
  { id: '2', name: 'PRESCRIPTION NOTES - DR. JOHNSON', date: '2024-01-14', doctor: 'DR. JOHNSON', status: 'PROCESSING' },
  { id: '3', name: 'LAB RESULTS - DR. WILLIAMS', date: '2024-01-13', doctor: 'DR. WILLIAMS', status: 'COMPLETED' },
];

const mockAllRecords = [
  { id: '1', name: 'PATIENT CHART - DR. SMITH', date: '2024-01-15', doctor: 'DR. SMITH', status: 'COMPLETED', summary: 'Routine check-up, patient healthy.' },
  { id: '2', name: 'PRESCRIPTION NOTES - DR. JOHNSON', date: '2024-01-14', doctor: 'DR. JOHNSON', status: 'PROCESSING', summary: 'Awaiting full transcription for medication details.' },
  { id: '3', name: 'LAB RESULTS - DR. WILLIAMS', date: '2024-01-13', doctor: 'DR. WILLIAMS', status: 'COMPLETED', summary: 'All markers within normal range.' },
  { id: '4', name: 'SURGERY REPORT - DR. EVA FOO', date: '2024-01-12', doctor: 'DR. EVA FOO', status: 'COMPLETED', summary: 'Successful appendectomy, no complications.' },
  { id: '5', name: 'X-RAY ANALYSIS - DR. BAR', date: '2024-01-11', doctor: 'DR. BAR', status: 'FAILED', summary: 'Image quality too low for analysis.' },
];

// export const uploadDocument = async (file) => {
//   await delay(1500);
//   // TODO: Replace with actual API call to Llama backend
//   // Example:
//   // const formData = new FormData();
//   // formData.append('document', file);
//   // const response = await fetch('/api/transcribe', { method: 'POST', body: formData });
//   // if (!response.ok) throw new Error('Upload failed');
//   // return response.json();

//   console.log('Simulating upload for:', file.name);
//   // Simulate a response, perhaps returning a job ID or initial status
//   return { success: true, message: `${file.name} uploaded successfully. Processing started.`, recordId: `temp-${Date.now()}` };
// };

export const getRecentRecords = async () => {
  await delay(1000);
  // TODO: Replace with actual API call
  // const response = await fetch('/api/records/recent');
  // if (!response.ok) throw new Error('Failed to fetch recent records');
  // return response.json();
  return mockRecentRecords;
};

export const getAllRecords = async ({ searchTerm = '', statusFilter = 'All Status' } = {}) => {
  await delay(1000);
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/records?search=${searchTerm}&status=${statusFilter}`);
  // if (!response.ok) throw new Error('Failed to fetch all records');
  // return response.json();
  let filteredRecords = mockAllRecords;
  if (searchTerm) {
    filteredRecords = filteredRecords.filter(record =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (statusFilter !== 'All Status') {
    filteredRecords = filteredRecords.filter(record => record.status.toUpperCase() === statusFilter.toUpperCase());
  }
  return filteredRecords;
};

export const getRecordDetails = async (recordId) => {
  await delay(500);
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/records/${recordId}`);
  // if (!response.ok) throw new Error('Failed to fetch record details');
  // return response.json();
  const record = mockAllRecords.find(r => r.id === recordId);
  if (record) {
    return record;
  } else {
    // Try recent records if not in all (though ideally all would be a superset)
    const recent = mockRecentRecords.find(r => r.id === recordId);
    if (recent) return { ...recent, summary: "Summary not available for this recent item yet."};
    throw new Error('Record not found');
  }
};


// src/services/api.js

// Define the base URL for your backend API

const API_BASE_URL = 'http://localhost:4000/api';

// --- Helper Functions ---

/**
 * Retrieves the JWT token from localStorage.
 * @returns {string|null} The token or null if not found.
 */
const getAuthToken = () => {
  return localStorage.getItem('medscribeUserToken');
};

/**
 * Sets the JWT token in localStorage.
 * @param {string} token - The JWT token.
 */
const setAuthToken = (token) => {
  localStorage.setItem('medscribeUserToken', token);
};

/**
 * Removes the JWT token from localStorage (logout).
 */
const removeAuthToken = () => {
  localStorage.removeItem('medscribeUserToken');
};

/**
 * Creates the Authorization header object if a token exists.
 * @returns {object} Headers object with Authorization, or empty object.
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

/**
 * A helper function to handle API responses and errors.
 * @param {Response} response - The fetch API response object.
 * @returns {Promise<object>} The JSON response.
 * @throws {Error} If the response is not ok.
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    // Attempt to get error message from backend, otherwise use default
    const error = (data && data.message) || response.statusText || `Request failed with status ${response.status}`;
    console.error('API Error:', error, 'Full response data:', data);
    throw new Error(error);
  }
  return data;
};

// --- Authentication API Calls ---

/**
 * Registers a new user.
 * @param {object} userData - { firstName, lastName, email, password }
 * @returns {Promise<object>} The user data and token from the backend.
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  const data = await handleResponse(response);
  if (data.token) {
    setAuthToken(data.token); // Store token on successful registration
  }
  return data;
};

/**
 * Logs in an existing user.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} The user data and token from the backend.
 */
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const data = await handleResponse(response);
  if (data.token) {
    setAuthToken(data.token); // Store token on successful login
  }
  return data;
};

/**
 * Logs out the current user by removing the token.
 */
export const logoutUser = () => {
  removeAuthToken();
  // Optionally, you might want to redirect the user or clear app state here
  console.log("User logged out.");
};

/**
 * Checks if a user is currently logged in (i.e., token exists).
 * @returns {boolean} True if a token exists, false otherwise.
 */
export const isLoggedIn = () => {
  return !!getAuthToken();
};


// --- Document API Calls ---

/**
 * Uploads a medical document.
 * @param {File} file - The file to upload.
 * @param {object} [additionalData={}] - Optional additional data like documentTitle, doctorName.
 * @returns {Promise<object>} The backend response.
 */
export const uploadDocument = async (file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('document', file); // 'document' must match the field name in Multer config

  // Append additional data to FormData if provided
  for (const key in additionalData) {
    if (additionalData.hasOwnProperty(key)) {
      formData.append(key, additionalData[key]);
    }
  }

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(), // Includes Authorization token
      // 'Content-Type': 'multipart/form-data' is set automatically by browser with FormData
    },
    body: formData,
  });
  return handleResponse(response);
};

/**
 * Fetches all documents for the logged-in user.
 * @returns {Promise<Array<object>>} Array of document objects.
 */
export const getUserDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Fetches recent documents for the logged-in user.
 * @returns {Promise<Array<object>>} Array of recent document objects.
 */
export const getRecentUserDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/documents/recent`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Fetches a specific document's metadata by its ID.
 * @param {string} documentId - The ID of the document.
 * @returns {Promise<object>} The document metadata object.
 */
export const getDocumentById = async (documentId) => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};


/**
 * Fetches transcription details for a specific document.
 * @param {string} documentId - The ID of the document.
 * @returns {Promise<object>} The transcription data.
 */
export const getDocumentTranscription = async (documentId) => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}/transcription`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// --- Example of how you might fetch current user details (if you add such an endpoint) ---
/**
 * Fetches details for the currently authenticated user.
 * (You'll need to create a GET /api/auth/me endpoint in your backend for this)
 * @returns {Promise<object>} User profile data.
 */
export const getCurrentUserProfile = async () => {
  // Assuming you create a GET /api/auth/me endpoint that returns user details based on token
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
