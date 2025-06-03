// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import RecentRecordCard from '../components/RecentRecordCard';
import { getRecentRecords, uploadDocument } from '../services/api';

const DashboardPage = () => {
  const [recentRecords, setRecentRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      try {
        const records = await getRecentRecords();
        setRecentRecords(records);
      } catch (error) {
        console.error("Error fetching recent records:", error);
        // Handle error display to user
      }
      setIsLoading(false);
    };
    fetchRecords();
  }, []);

  const handleFileForDashboardUpload = async (file) => {
    setUploadMessage(`Uploading ${file.name}...`);
    setIsLoading(true);
    try {
      const response = await uploadDocument(file);
      setUploadMessage(response.message || 'Upload successful! Processing started.');
      // Optionally, refresh recent records or add the new one optimistically
      const records = await getRecentRecords(); // Re-fetch
      setRecentRecords(records);
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadMessage(`Upload failed for ${file.name}. ${error.message}`);
    }
    setIsLoading(false);
  };


  return (
    <div>
      <h1 className="dashboard-main-title">MEDICAL DOCUMENT PROCESSING</h1>
      <p className="dashboard-subtitle">
        TRANSFORM HANDWRITTEN MEDICAL DOCUMENTS INTO STRUCTURED DIGITAL RECORDS USING ADVANCED OCR AND AI TECHNOLOGY
      </p>

      <FileUpload
        onFileSelect={handleFileForDashboardUpload}
        instructionText="UPLOAD MEDICAL DOCUMENT"
        browseButtonText="CHOOSE FILE"
      />
      {uploadMessage && <p style={{ textAlign: 'center', margin: '10px 0', color: uploadMessage.includes('failed') ? 'red' : '#39FF14' }}>{uploadMessage}</p>}


      <h2 className="section-title">RECENT RECORDS</h2>
      {isLoading && recentRecords.length === 0 && <p>Loading recent records...</p>}
      {!isLoading && recentRecords.length === 0 && <p>No recent records found.</p>}
      <div>
        {recentRecords.map(record => (
          <RecentRecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;