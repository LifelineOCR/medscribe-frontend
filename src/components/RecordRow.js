// src/components/RecordRow.js
import React from 'react';
import StatusBadge from './StatusBadge';

const RecordRow = ({ record }) => {
  const handleViewDetails = () => {
    // Placeholder for viewing full details, maybe navigate to a new page or open a modal
    alert(`Viewing details for ${record.name}. Implement record detail view.`);
    console.log("View record:", record.id);
  };

  return (
    <tr>
      <td>{record.name}</td>
      <td>{record.date}</td>
      <td>{record.doctor}</td>
      <td><StatusBadge status={record.status} /></td>
      <td>{record.summary || 'N/A'}</td>
      <td>
        <button onClick={handleViewDetails} className="button-primary" style={{padding: '5px 10px', fontSize: '0.9rem'}}>
          VIEW
        </button>
        {/* Add other actions like Edit/Delete if needed */}
      </td>
    </tr>
  );
};

export default RecordRow;