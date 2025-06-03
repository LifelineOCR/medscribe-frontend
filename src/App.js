// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import RecordsPage from './pages/RecordsPage';
import SettingsPage from './pages/SettingsPage';
import './index.css'; // Ensure styles are imported

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/records" element={<RecordsPage />} />
          {/* <Route path="/records/:recordId" element={<RecordDetailPage />} />  // Example for detail page */}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;