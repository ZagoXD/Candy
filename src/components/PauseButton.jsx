import React from 'react';
import './PauseButton.css';
import candy from '../assets/images/candy.png'
import clickSound from '../assets/sounds/pop.mp3'

const PauseButton = ({ onResume }) => {

  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  const handleClick = () => {
    playClickSound();
    onResume();
  };

  return (
    <div className='pause-back'>
      <div className="pause-container">
        <img src={candy} alt="titulo" className='imgPause' />
        <button className="pause-button" onClick={handleClick}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default PauseButton;