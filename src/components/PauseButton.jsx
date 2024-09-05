import React from 'react';
import './PauseButton.css';
import candy from '../assets/images/candy.png';
import clickSound from '../assets/sounds/pop.mp3';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const PauseButton = ({ onResume, toggleMusic, isMusicPlaying }) => {

  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  const handleClick = () => {
    playClickSound();
    onResume();
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
    <div className='pause-back'>
      <div className="pause-container">
        <img src={candy} alt="titulo" className='imgPause' />
        <button className="pause-button" onClick={handleClick}>
          Continuar
        </button>
        <div className='btnsPause'>
          <button onClick={toggleMusic} className='spacePause'>
          {isMusicPlaying ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </button>
          <button onClick={openLinkedin} className='spacePause'>
            <LinkedInIcon/>
          </button>
          <button onClick={openGit} className='spacePause'>
            <GitHubIcon/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseButton;
