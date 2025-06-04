// src/pages/RecordDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { getDocumentTranscription, getDocumentById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const RecordDetailPage = () => {
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate(); // For redirecting if ID is truly problematic

  useEffect(() => {
    console.log("RecordDetailPage: recordId from useParams:", recordId); // Log the ID

    if (!isLoggedIn) {
      setError("Please log in to view record details.");
      setIsLoading(false);
      return;
    }

    // **CRUCIAL GUARD HERE**
    if (!recordId || recordId === "undefined") { // Check for undefined string as well
      console.error("RecordDetailPage: recordId is undefined or invalid. Cannot fetch details.");
      setError("Invalid Record ID. Cannot fetch details.");
      setIsLoading(false);
      // Optionally redirect back or show a more permanent error
      // setTimeout(() => navigate('/records'), 3000); // Example redirect
      return;
    }

    const fetchRecordDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const docData = await getDocumentById(recordId);
        setRecord(docData);

        const transData = await getDocumentTranscription(recordId);
        if (transData.transcription) {
          setTranscription(transData.transcription);
        } else if (transData.message) {
          setTranscription({ message: transData.message, processingStatus: transData.processingStatus || docData.processingStatus });
        } else {
           setTranscription({ message: "Transcription data not available.", processingStatus: docData.processingStatus });
        }
      } catch (err) {
        console.error(`RecordDetailPage: Error fetching details for ID ${recordId}:`, err);
        if (err.message && err.message.toLowerCase().includes('cast to objectid failed')) {
            setError(`Invalid Record ID format: ${recordId}. Please check the link or go back.`);
        } else {
            setError(err.message || "Failed to load record details.");
        }
      }
      setIsLoading(false);
    };

    fetchRecordDetails();
  }, [recordId, isLoggedIn, navigate]); // Added navigate to dependency array if used in effect

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading record details...</div>;
  }

  if (error) {
    return (
      <div className="page-container card">
        <p className="error-message" style={{ textAlign: 'center' }}>Error: {error}</p>
        <Link to="/records" className="button-primary" style={{marginTop: '20px', display: 'block', textAlign: 'center'}}>Back to Records</Link>
      </div>
    );
  }

  if (!record) {
    return (
         <div className="page-container card">
            <p style={{ textAlign: 'center', padding: '20px' }}>Record not found.</p>
            <Link to="/records" className="button-primary" style={{marginTop: '20px', display: 'block', textAlign: 'center'}}>Back to Records</Link>
        </div>
    );
  }

  return (
    <div className="page-container card">
      <Link to="/records" className="button-primary" style={{marginBottom: '20px', display: 'inline-block'}}> &larr; Back to Records</Link>
      <h1 className="page-title">{record.documentTitle || record.originalFileName}</h1>

      <div className="record-metadata">
        <p><strong>Record ID:</strong> {record._id}</p> {/* Display the ID for debugging */}
        <p><strong>Uploaded:</strong> {new Date(record.uploadDate).toLocaleString()}</p>
        <p><strong>File Type:</strong> {record.fileType}</p>
        <p><strong>Status:</strong> <StatusBadge status={record.processingStatus} /></p>
        {record.storageFileName && (
             <p>
                <strong>Original File:</strong>{' '}
                <a
                    href={`http://localhost:4000/api/documents/file/${record.storageFileName}`} // Ensure port matches backend
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-styled"
                >
                    View/Download Original
                </a>
            </p>
        )}
      </div>

      <hr style={{margin: "30px 0", borderColor: "var(--border-color)"}}/>

      <h2 className="section-title">Transcription Details</h2>
      {transcription ? (
        transcription.message ? (
            <div className="transcription-status">
                <p>{transcription.message}</p>
                {transcription.processingStatus && <p>Current Status: <StatusBadge status={transcription.processingStatus} /></p>}
            </div>
        ) : (
          <div className="transcription-content">
            <h3>Transcribed Text:</h3>
            <pre className="transcribed-text-block">{transcription.transcribedText || "No text transcribed."}</pre>

            {transcription.structuredData && Object.keys(transcription.structuredData).length > 0 && (
              <>
                <h3>Structured Data:</h3>
                <pre className="structured-data-block">
                  {JSON.stringify(transcription.structuredData, null, 2)}
                </pre>
              </>
            )}
            {typeof transcription.confidenceScore === 'number' && <p><strong>Confidence:</strong> {transcription.confidenceScore.toFixed(2)}</p>}
            {transcription.processingTimeMs && <p><strong>Processing Time:</strong> {(transcription.processingTimeMs / 1000).toFixed(2)}s</p>}
          </div>
        )
      ) : (
        <p>Loading transcription...</p>
      )}
    </div>
  );
};

export default RecordDetailPage;
