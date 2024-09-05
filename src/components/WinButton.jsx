import React from 'react';
import './WinButton.css';
import candy from '../assets/images/candy.png';
import clickSound from '../assets/sounds/pop.mp3';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const WinButton = ({ onRestart, score }) => {

  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  const handleClick = () => {
    playClickSound();
    onRestart();
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
    <div className='win-back'>
      <div className="win-container">
        <img src={candy} alt="titulo" className='imgWin' />
        <h1 className="win-message">Parabéns! Sua pontuação foi: {score}</h1>
        <button className="win-button" onClick={handleClick}>
          Recomeçar
        </button>
        <div className='btnsWin'>
          <button onClick={openLinkedin} className='spaceWin'>
            <LinkedInIcon/>
          </button>
          <button onClick={openGit} className='spaceWin'>
            <GitHubIcon/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinButton;

