import React from 'react';

function ActionButton({ label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontSize: '1.1rem',
        margin: '10px',
        padding: '10px 20px',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {label}
    </button>
  );
}

export default ActionButton;
