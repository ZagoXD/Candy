// RetryButton.jsx
import React from 'react';
import './RetryButton.css';
import candy from '../assets/images/candy.png';
import clickSound from '../assets/sounds/pop.mp3';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const RetryButton = ( {onRetry, level} ) => {

  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  const handleClick = () => {
    playClickSound();
    onRetry();
  };

  const openLinkedin = () => {
    const url = 'https://www.linkedin.com/in/gustavo-zago-2a2066265/';
    window.open(url, '_blank');
  };

  const openGit = () => {
    const url = 'https://github.com/ZagoXD';
    window.open(url, '_blank');
  };

  return (
    <div className='retry-back'>
      <div className="retry-container">
        <img src={candy} alt="titulo" className='imgRetry' />
        <h1 className="retry-message">Você não atingiu a pontuação mínima no nível: {level} . Tente novamente!</h1>
        <button className="retry-button" onClick={handleClick}>
          Tentar Novamente
        </button>
        <div className='btnsRetry'>
          <button onClick={openLinkedin} className='spaceRetry'>
            <LinkedInIcon/>
          </button>
          <button onClick={openGit} className='spaceRetry'>
            <GitHubIcon/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetryButton;
