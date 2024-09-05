import React from 'react';
import './StartButton.css';
import candy from '../assets/images/candy.png';
import clickSound from '../assets/sounds/pop.mp3';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const StartButton = ({ onStart, toggleMusic, isMusicPlaying }) => {

  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  const handleClick = () => {
    playClickSound();
    onStart();
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
    <div className='start-back'>
      <div className="start-container">
        <img src={candy} alt="titulo" className='imgStart' />
        <button className="start-button" onClick={handleClick}>
          Começar
        </button>
        <div className='btnsStart'>
          <button onClick={toggleMusic} className='spaceStart'>
          {isMusicPlaying ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </button>
          <button onClick={openLinkedin} className='spaceStart'>
            <LinkedInIcon/>
          </button>
          <button onClick={openGit} className='spaceStart'>
            <GitHubIcon/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartButton;
