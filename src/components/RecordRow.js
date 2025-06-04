// src/components/RecordRow.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const RecordRow = ({ record }) => {
  const navigate = useNavigate();

  // Log the received record prop for debugging
  // console.log("RecordRow: Received record prop:", record);

  const handleViewDetails = () => {
    console.log("RecordRow: handleViewDetails triggered.");
    console.log("RecordRow: Full record object in handleViewDetails:", record);

    if (record && record._id) {
      console.log("RecordRow: Valid record and _id found. Navigating with ID:", record._id);
      navigate(`/records/${record._id}`);
    } else {
      console.error("RecordRow: ERROR - record or record._id is undefined or invalid.");
      console.error("RecordRow: record object:", record);
      console.error("RecordRow: record._id:", record ? record._id : "record is undefined");
      alert("Debug: Cannot navigate. Record ID is missing. Check console for details.");
    }
  };

  // Defensive check for the record prop
  if (!record || typeof record !== 'object') {
    console.error("RecordRow: Rendering with invalid or missing record prop.", record);
    return (
      <tr>
        <td colSpan="5">Error: Invalid record data for this row.</td> {/* Adjust colSpan based on your table headers */}
      </tr>
    );
  }

  return (
    <tr>
      <td>{record.documentTitle || record.originalFileName || 'Untitled Record'}</td>
      <td>{record.uploadDate ? new Date(record.uploadDate).toLocaleDateString() : 'N/A'}</td>
      <td>{record.doctorName || 'N/A'}</td>
      <td><StatusBadge status={record.processingStatus || 'UNKNOWN'} /></td>
      {/* The summary is typically on the detail page.
          If you have a short summary available in the main record object, you can display it here.
          Otherwise, users will click VIEW for the full transcription/summary.
          For now, let's assume summary is not in the main list object.
      */}
      {/* <td>{record.shortSummary || 'N/A'}</td> */}
      <td>
        <button
          onClick={handleViewDetails}
          className="button-primary"
          style={{ padding: '6px 12px', fontSize: '0.85rem' }} // Adjusted padding slightly
        >
          VIEW
        </button>
      </td>
    </tr>
  );
};

export default RecordRow;
