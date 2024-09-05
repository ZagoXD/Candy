import React from 'react';
import './NextButton.css';

const NextButton = ({ onNext }) => {
  return (
    <div className="next-container">
      <button className="next-button" onClick={onNext}>
        Próximo Nível
      </button>
    </div>
  );
};

export default NextButton;