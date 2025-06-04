// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload'; // Assuming you have these
import RecentRecordCard from '../components/RecentRecordCard'; // Assuming you have these
import { getRecentRecords, uploadDocument } from '../services/api'; // Using getRecentRecords
import { useAuth } from '../context/AuthContext'; // To check login status

const DashboardPage = () => {
  const [recentRecords, setRecentRecords] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchRecentDocs = async () => {
      if (!isLoggedIn) {
        // Don't fetch if not logged in, or handle as needed
        setRecentRecords([]); // Ensure it's an empty array
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
            const response = await getRecentRecords();
            console.log("DashboardPage: Full API response for recent records:", response); // Log the whole response
            if (response && Array.isArray(response.data)) {
                console.log("DashboardPage: Setting recentRecords with:", response.data);
                // Log the first record to check its structure, specifically for _id
                if (response.data.length > 0) {
                    console.log("DashboardPage: First record object from API:", response.data[0]);
                }
                setRecentRecords(response.data);
            } else {
          console.error("DashboardPage: API did not return an array for recent records.", response);
          setRecentRecords([]); // Fallback to empty array
          setError("Could not load recent records correctly.");
        }
      } catch (err) {
        console.error("DashboardPage: Error fetching recent records:", err);
        setError(err.message || "Failed to fetch recent records.");
        setRecentRecords([]); // Fallback to empty array on error
      }
      setIsLoading(false);
    };

    fetchRecentDocs();
  }, [isLoggedIn]); // Re-fetch if login status changes

  const handleFileForDashboardUpload = async (file) => {
    if (!isLoggedIn) {
        setUploadMessage("Please log in to upload documents.");
        return;
    }
    setUploadMessage(`Uploading ${file.name}...`);
    setIsUploading(true);
    setError(null); // Clear previous errors
    try {
      const response = await uploadDocument(file, { documentTitle: file.name.split('.')[0] });
      setUploadMessage(response.message || 'Upload successful! Processing started.');
      // Optionally, refresh recent records or add the new one optimistically
      // For simplicity, we'll rely on the next full fetch or a manual refresh action
      // Re-fetch recent records to show the newly uploaded one (if processing is quick)
      if (isLoggedIn) {
        const updatedRecords = await getRecentRecords();
        if (Array.isArray(updatedRecords)) {
            setRecentRecords(updatedRecords);
        }
      }
    } catch (err) {
      console.error("DashboardPage: Error uploading document:", err);
      setUploadMessage(`Upload failed for ${file.name}. ${err.message}`);
      setError(err.message || `Upload failed for ${file.name}.`);
    }
    setIsUploading(false);
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
      {isUploading && <p style={{ textAlign: 'center', margin: '10px 0' }}>Uploading, please wait...</p>}
      {uploadMessage && !error && <p style={{ textAlign: 'center', margin: '10px 0', color: 'var(--success-color)' }}>{uploadMessage}</p>}
      {/* Display general error for upload if it occurred */}
      {error && uploadMessage.includes('failed') && <p className="error-message" style={{textAlign: 'center'}}>{error}</p>}


      <h2 className="section-title">RECENT RECORDS</h2>
      {isLoading && <p>Loading recent records...</p>}
      {/* Display error from fetching recent records */}
      {error && !uploadMessage.includes('failed') && <p className="error-message">{error}</p>}

      {!isLoading && !error && Array.isArray(recentRecords) && recentRecords.length > 0 ? (
    <div>
        {recentRecords.map((individualRecord, index) => {
            // Log each individualRecord being passed as a prop
            console.log(`DashboardPage: Mapping record at index ${index}:`, individualRecord);
            return (
                <RecentRecordCard
                    key={individualRecord._id || `record-${index}`} // Ensure a unique key
                    record={individualRecord} // Pass the whole object
                />
            );
        })}
    </div>
      ) : (
        !isLoading && !error && <p>No recent records found.</p>
      )}
    </div>
  );
};

export default DashboardPage;
