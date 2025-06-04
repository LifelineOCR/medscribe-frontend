// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import RecordsPage from './pages/RecordsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute'; // Ensure this path is correct
import { AuthProvider, useAuth } from './context/AuthContext';
import { isLoggedIn as isUserLoggedInUtility } from './services/api'; // Import the utility function
import RecordDetailPage from './pages/RecordDetailPage';
import './index.css'; // Main CSS file

// This component redirects logged-in users away from login/register pages
const PublicOnlyRoute = ({ children }) => {
  const { isLoggedIn, isLoadingAuth } = useAuth(); // isLoggedIn from context for this specific route type
  if (isLoadingAuth) {
    // It's important to handle the loading state to prevent premature redirects
    return <div style={{textAlign: 'center', padding: '50px', fontSize: '1.2rem'}}>Loading authentication...</div>;
  }
  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

function AppContent() {
  return (
    <Layout>
      <Routes>
        {/* ... PublicOnlyRoutes for login/register ... */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/records/:recordId" element={<RecordDetailPage />} /> {/* ADD THIS LINE */}
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to={isUserLoggedInUtility() ? "/" : "/login"} replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
