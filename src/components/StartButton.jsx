import React from 'react';
import './StartButton.css';

const StartButton = ({ onStart, isPaused }) => {
  return (
    <div className="start-container">
      <button className="start-button" onClick={onStart}>
        {isPaused ? 'Continuar' : 'Começar'}
      </button>
    </div>
  );
};

export default StartButton;
