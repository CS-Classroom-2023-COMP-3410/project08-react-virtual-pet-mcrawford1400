import React from 'react';
import './StatusBar.css';

function StatusBar({ label, value }) {
  const getColor = () => {
    if (value> 70) return 'green';
    if (value > 40) return 'orange';
    return 'red';
  };
  return (
    <div className="status-bar">
      <label>{label}</label>
      <div className="bar-container">
        <div
        className="bar-fill"
          style={{ width: `${value}%`, backgroundColor: getColor() }}
        />
      </div>
      <span>{Math.round(value)}</span>
    </div>
  );
}

export default StatusBar;
