import React from 'react';
import './StartButton.css';

const StartButton = ({ onStart}) => {
  return (
    <div className="start-container">
      <button className="start-button" onClick={onStart}>
       Começar
      </button>
    </div>
  );
};

export default StartButton;
