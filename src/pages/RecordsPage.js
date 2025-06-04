// src/pages/RecordsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import RecordRow from '../components/RecordRow';
import { getAllRecords } from '../services/api'; // Using getAllRecords which now takes filters
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // For navigation to login page

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status'); // Default value for the dropdown
  const { isLoggedIn } = useAuth();

  const fetchRecords = useCallback(async () => {
    if (!isLoggedIn) {
      setError("Please log in to view records.");
      setIsLoading(false);
      setRecords([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log(`RecordsPage: Fetching records with searchTerm: '${searchTerm}', statusFilter: '${statusFilter}'`);
      const data = await getAllRecords({ searchTerm, status: statusFilter }); // Pass filters
      
      // Check if the response is an array directly, or if it's wrapped in a 'data' object
      // Based on your previous console log for recent records, it might be { data: [...] }
      // Adjust this based on your actual API response structure for this endpoint
      if (Array.isArray(data)) {
          setRecords(data);
      } else if (data && Array.isArray(data.data)) { // If it's wrapped
          setRecords(data.data);
          console.log("RecordsPage: API response was wrapped, extracted records from data.data");
      } else {
          console.error("RecordsPage: API did not return an array for records.", data);
          setRecords([]);
          setError("Could not load records correctly (unexpected format).");
      }

    } catch (err) {
      console.error("RecordsPage: Error fetching records:", err);
      setError(err.message || "Could not fetch records.");
      setRecords([]);
    }
    setIsLoading(false);
  }, [isLoggedIn, searchTerm, statusFilter]); // Dependencies are correct

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecords(); // fetchRecords will use the current searchTerm and statusFilter states
  };

  if (!isLoggedIn && !isLoading) {
      return <div className="auth-page" style={{textAlign: 'center'}}><p>Please <Link to="/login" className="link-styled">login</Link> to view your records.</p></div>;
  }

  return (
    <div>
      <h1 className="page-title">MEDICAL RECORDS ARCHIVE</h1>
      <form onSubmit={handleSearchSubmit} className="search-bar-container card">
        <input
          type="text"
          placeholder="Search by name, title, doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All Status">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
        <button type="submit" className="button-primary" disabled={isLoading}>
          {isLoading ? 'SEARCHING...' : 'SEARCH'}
        </button>
      </form>

      {isLoading && <p style={{textAlign: 'center'}}>Loading records...</p>}
      {error && <p className="error-message" style={{textAlign: 'center'}}>{error}</p>}
      {!isLoading && !error && records.length === 0 && <p style={{textAlign: 'center'}}>No records found matching your criteria.</p>}

      {!isLoading && !error && records.length > 0 && (
        <div className="records-table-container">
          <table className="records-table">
            <thead>
              <tr>
                <th>DOCUMENT NAME</th>
                <th>UPLOAD DATE</th>
                <th>DOCTOR</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <RecordRow key={record._id || record.id} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecordsPage;
