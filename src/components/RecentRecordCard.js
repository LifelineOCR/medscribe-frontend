// src/components/RecentRecordCard.js
import React from 'react';
import StatusBadge from './StatusBadge';
// import { useNavigate } from 'react-router-dom'; // If "VIEW" navigates

const RecentRecordCard = ({ record }) => {
  // const navigate = useNavigate(); // If "VIEW" should navigate

  const handleView = () => {
    console.log("View record:", record.id);
    // navigate(`/records/${record.id}`); // Example navigation
    alert(`Viewing details for ${record.name} (ID: ${record.id}). Implement actual view page/modal.`);
  };

  return (
    <div className="recent-record-card">
      <div className="info">
        <h4>{record.name}</h4>
        <p>{record.date} - {record.doctor}</p>
      </div>
      <div className="actions">
        <StatusBadge status={record.status} />
        <button onClick={handleView} className="button-primary">VIEW</button>
      </div>
    </div>
  );
};

export default RecentRecordCard;