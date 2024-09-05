import React from 'react';
import './NextButton.css';
import candy from '../assets/images/candy.png';
import clickSound from '../assets/sounds/pop.mp3';

const NextButton = ({ onNext, toggleMusic, isMusicPlaying }) => {

  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  const handleClick = () => {
    playClickSound();
    onNext();
  };

  return (
    <div className='next-back'>
      <div className="next-container">
        <img src={candy} alt="titulo" className='imgNext' />
        <button className="next-button" onClick={handleClick}>
          Próximo Nível
        </button>
        <button className="music-toggle" onClick={toggleMusic}>
          {isMusicPlaying ? '🔊' : '🔇'} 
        </button>
      </div>
    </div>
  );
};

export default NextButton;
