import React from 'react';
import './PauseButton.css';

const PauseButton = ({ onResume }) => {
  return (
    <div className="pause-container">
      <button className="pause-button" onClick={onResume}>
        Continuar
      </button>
    </div>
  );
};

export default PauseButton;