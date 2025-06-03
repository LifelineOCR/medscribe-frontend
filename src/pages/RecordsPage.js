// src/pages/RecordsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import RecordRow from '../components/RecordRow';
import { getAllRecords } from '../services/api';

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllRecords({ searchTerm, statusFilter });
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
      // Handle error display
    }
    setIsLoading(false);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]); // fetchRecords will change if searchTerm or statusFilter changes

  const handleSearch = (e) => {
    e.preventDefault(); // If it were in a form
    fetchRecords(); // Trigger fetch with current searchTerm and statusFilter
  };

  return (
    <div>
      <h1 className="page-title">MEDICAL RECORDS ARCHIVE</h1>

      <div className="search-bar-container card"> {/* Styled as a card for consistency */}
        <input
          type="text"
          placeholder="SEARCH RECORDS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All Status">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PROCESSING">Processing</option>
          <option value="FAILED">Failed</option>
        </select>
        <button onClick={handleSearch} className="button-primary" disabled={isLoading}>
          {isLoading ? 'SEARCHING...' : 'SEARCH'}
        </button>
      </div>

      {isLoading && records.length === 0 && <p>Loading records...</p>}
      {!isLoading && records.length === 0 && <p>No records found matching your criteria.</p>}

      {records.length > 0 && (
        <table className="records-table card"> {/* Styled as a card for consistency */}
          <thead>
            <tr>
              <th>DOCUMENT NAME</th>
              <th>DATE</th>
              <th>DOCTOR</th>
              <th>STATUS</th>
              <th>SUMMARY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <RecordRow key={record.id} record={record} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecordsPage;