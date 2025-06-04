// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuthToken as retrieveToken,
  setAuthToken as storeTokenInStorage,
  removeAuthToken as clearTokenFromStorage
} from '../services/api'; // Ensure these are correctly exported from api.js

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthTokenState] = useState(retrieveToken());
  const [currentUser, setCurrentUser] = useState(() => {
    // Initialize currentUser from localStorage if available
    // This helps maintain user info across page refreshes if the token is still valid
    // You'd need to ensure your backend validates the token on subsequent requests anyway.
    // const storedUserDetails = localStorage.getItem('medscribeUserDetails');
    // return storedUserDetails ? JSON.parse(storedUserDetails) : null;
    return null; // Or initialize as above
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const token = retrieveToken();
    if (token) {
      setAuthTokenState(token);
      // Optionally, fetch user profile here if token exists to verify it and get fresh user data
      // For example:
      // api.getCurrentUserProfile().then(user => setCurrentUser(user)).catch(() => logout());
    }
    setIsLoadingAuth(false); // Crucial: set loading to false after initial check
    // console.log("AuthContext: Initial auth check complete. Token:", token);
  }, []);

  const login = (token, userDetails) => {
    console.log("AuthContext: login function called with token:", !!token, "User details:", userDetails);
    storeTokenInStorage(token); // Stores in localStorage via api.js
    setAuthTokenState(token);   // **This state update is key for reactivity**
    if (userDetails) {
      setCurrentUser(userDetails);
      // localStorage.setItem('medscribeUserDetails', JSON.stringify(userDetails)); // Optional: persist user details
    }
    console.log("AuthContext: authToken state updated to:", token);
  };

  const logout = () => {
    console.log("AuthContext: logout function called");
    clearTokenFromStorage();
    // localStorage.removeItem('medscribeUserDetails');
    setAuthTokenState(null);
    setCurrentUser(null);
  };

  const value = {
    authToken,
    currentUser,
    isLoggedIn: !!authToken, // Derived from authToken state
    isLoadingAuth,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};