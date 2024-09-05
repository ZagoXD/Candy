import React from 'react';
import './NextButton.css';
import candy from '../assets/images/candy.png';
import clickSound from '../assets/sounds/pop.mp3';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const NextButton = ({ onNext, toggleMusic, isMusicPlaying }) => {

  const playClickSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  const handleClick = () => {
    playClickSound();
    onNext();
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
    <div className='next-back'>
      <div className="next-container">
        <img src={candy} alt="titulo" className='imgNext' />
        <button className="next-button" onClick={handleClick}>
          Próximo Nível
        </button>
        <div className='btnsNext'>
          <button onClick={toggleMusic} className='spaceNext'>
          {isMusicPlaying ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </button>
          <button onClick={openLinkedin} className='spaceNext'>
            <LinkedInIcon/>
          </button>
          <button onClick={openGit} className='spaceNext'>
            <GitHubIcon/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextButton;
