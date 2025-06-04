// src/components/RecentRecordCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const RecentRecordCard = ({ record }) => {
  const navigate = useNavigate();

  const handleView = () => {
    // **CRUCIAL CHECK HERE**
    if (record && record._id) { // Ensure record and record._id exist
      console.log("RecentRecordCard: Navigating to view record with ID:", record._id);
      navigate(`/records/${record._id}`);
    } else {
      console.error("RecentRecordCard: Attempted to view record with undefined ID. Record object:", record);
      alert("Error: Cannot view details for this record because its ID is missing or the record data is incomplete.");
    }
  };

  // Defensive check for the record prop itself
  if (!record || typeof record !== 'object') {
    return (
      <div className="recent-record-card card">
        <p>Error: Invalid record data provided.</p>
      </div>
    );
  }

  return (
    <div className="recent-record-card card"> {/* Added card class for consistency */}
      <div className="info">
        <h4>{record.documentTitle || record.originalFileName || 'Untitled Record'}</h4>
        <p>
          {record.uploadDate ? new Date(record.uploadDate).toLocaleDateString() : 'N/A'}
          {record.doctorName ? ` - ${record.doctorName}` : ''}
        </p>
      </div>
      <div className="actions">
        <StatusBadge status={record.processingStatus || 'UNKNOWN'} />
        <button onClick={handleView} className="button-primary">VIEW</button>
      </div>
    </div>
  );
};

export default RecentRecordCard;