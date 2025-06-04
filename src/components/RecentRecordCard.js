// src/components/RecentRecordCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const RecentRecordCard = ({ record }) => {
  const navigate = useNavigate();

  // Log the received record prop as soon as the component renders/re-renders
  console.log("RecentRecordCard: Received record prop:", record);

  const handleView = () => {
    console.log("RecentRecordCard: handleView triggered.");
    console.log("RecentRecordCard: Full record object in handleView:", record); // Log the whole object

    if (record && record._id) {
      console.log("RecentRecordCard: Valid record and _id found. Navigating with ID:", record._id);
      navigate(`/records/${record._id}`);
    } else {
      console.error("RecentRecordCard: ERROR - record or record._id is undefined or invalid.");
      console.error("RecentRecordCard: record object:", record);
      console.error("RecentRecordCard: record._id:", record ? record._id : "record is undefined");
      alert("Debug: Cannot navigate. Record ID is missing. Check console for details.");
    }
  };

  // Defensive check for the record prop itself to prevent rendering errors
  if (!record || typeof record !== 'object') {
    console.error("RecentRecordCard: Rendering with invalid or missing record prop.", record);
    return (
      <div className="recent-record-card card">
        <p>Error: Invalid record data for this card.</p>
      </div>
    );
  }

  return (
    <div className="recent-record-card card">
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
