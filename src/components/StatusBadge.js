// src/components/StatusBadge.js
import React from 'react';

const StatusBadge = ({ status }) => {
  let className = 'status-badge';
  switch (status?.toLowerCase()) {
    case 'completed':
      className += ' completed';
      break;
    case 'processing':
      className += ' processing';
      break;
    case 'failed':
      className += ' failed';
      break;
    default:
      className += ' unknown'; // Add a style for unknown if needed
  }

  return (
    <span className={className}>
      {status || 'N/A'}
    </span>
  );
};

export default StatusBadge;