// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser as apiLoginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  // ... (email, password, error, isLoading states)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Determine the path to redirect to after login
  // If the user was redirected to login from a protected page, 'from' will be set.
  const from = location.state?.from?.pathname || "/"; // Default to dashboard

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log("LoginPage: Attempting login..."); // Debug log
    try {
      const response = await apiLoginUser({ email, password });
      console.log("LoginPage: Login API response:", response); // Debug log
	//   console.log("LoginPage: Response token:", response.data.accessToken);
	  const accessToken = response.accessToken // Debug log
      if (
		accessToken) {
        // The login function in AuthContext handles setting the token state
        // and potentially user details in the context.
        login(accessToken, {
          email: response.email,
          firstName: response.firstName, // Ensure your backend login response includes these
          _id: response._id
        });
        console.log(`LoginPage: Login successful, navigating to: ${from}`); // Debug log
        navigate(from, { replace: true }); // This is the redirection call
      } else {
        // This case should ideally be handled by apiLoginUser throwing an error
        // if the token is missing from a successful (2xx) response,
        // or handleResponse throwing an error for non-2xx responses.
        setError("Login successful, but no token received.");
        console.error("LoginPage: Login successful but no token in response", response);
      }
    } catch (err) {
      console.error('LoginPage: Login error caught:', err); // Debug log
      setError(err.message || 'Login failed. Please check your credentials.');
    }
    setIsLoading(false);
  };

  return (
    // ... JSX for the login form ...
    <div className="auth-page">
      <div className="auth-container card">
        <h1 className="page-title">Login</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="button-primary" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;