import React from 'react';
import './StartButton.css';
import candy from '../assets/images/candy.png'
import clickSound from '../assets/sounds/pop.mp3'

const StartButton = ({ onStart}) => {

  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  const handleClick = () => {
    playClickSound();
    onStart();
  };

  return (
    <div className='start-back'>
      <div className="start-container">
        <img src={candy} alt="titulo" className='imgStart' />
        <button className="start-button" onClick={handleClick}>
        Começar
        </button>
      </div>
    </div>
  );
};

export default StartButton;
