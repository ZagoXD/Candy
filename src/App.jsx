import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import cursorImage from './assets/images/mouse.png';
import bala1 from './assets/images/bala1.png';
import bala2 from './assets/images/bala2.png';
import bala3 from './assets/images/bala3.png';
import chicle1 from './assets/images/chicle1.png';
import choco1 from './assets/images/choco1.png';
import pirulito1 from './assets/images/pirulito1.png';
import pirulito2 from './assets/images/pirulito2.png';
import pirulito3 from './assets/images/pirulito3.png';
import popSoundFile from './assets/sounds/pop.mp3';
import StartButton from './components/StartButton'; // Importando o componente StartButton

const fallingItems = [bala1, bala2, bala3, chicle1, choco1, pirulito1, pirulito2, pirulito3];

function App() {
  const [mouseX, setMouseX] = useState(0);
  const [score, setScore] = useState(0);
  const [fallingObjects, setFallingObjects] = useState([]);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false); 
  const [gameStarted, setGameStarted] = useState(false); // Controla se o jogo começou
  const [isPaused, setIsPaused] = useState(false); // Controla se o jogo está pausado

  const popSound = useRef(null);

  // Função para iniciar ou continuar o jogo
  const startGame = () => {
    setIsPaused(false); // Remove a pausa, se houver
    setGameStarted(true); // Inicia o jogo
  };

  const unlockAudio = () => {
    if (!isAudioUnlocked) {
      popSound.current = new Audio(popSoundFile);
      setIsAudioUnlocked(true);
    }
  };

  const playPopSound = () => {
    if (popSound.current) {
      popSound.current.currentTime = 0;
      popSound.current.play().catch((error) => {
        console.error('Erro ao tocar o áudio:', error);
      });
    }
  };

  const cursorWidth = 70;
  const cursorHeight = 70;
  const objectWidth = 50;
  const objectHeight = 50;

  const handleMouseMove = (event) => {
    const maxX = window.innerWidth - cursorWidth;
    setMouseX(Math.min(event.clientX, maxX));
    unlockAudio();
  };

  const getDifficultySettings = (currentScore) => {
    if (currentScore <= 5) {
      return { speedMultiplier: 0.5, spawnRate: 2000 };
    } else if (currentScore <= 10) {
      return { speedMultiplier: 1, spawnRate: 1500 };
    } else if (currentScore <= 15) {
      return { speedMultiplier: 1.5, spawnRate: 1000 };
    } else {
      return { speedMultiplier: 2, spawnRate: 500 };
    }
  };

  // Captura da tecla "Esc" para pausar o jogo
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && gameStarted) {
        setIsPaused((prev) => !prev); // Alterna o estado de pausa
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted || isPaused) return; // Pausa o jogo se estiver pausado

    const { spawnRate } = getDifficultySettings(score);

    const createFallingObject = () => {
      const randomIndex = Math.floor(Math.random() * fallingItems.length);
      const object = {
        id: Date.now(),
        src: fallingItems[randomIndex],
        x: Math.random() * (window.innerWidth - objectWidth),
        y: -100,
        speed: (Math.random() * 5 + 2) * getDifficultySettings(score).speedMultiplier,
      };
      setFallingObjects((prevObjects) => [...prevObjects, object]);
    };

    const intervalId = setInterval(createFallingObject, spawnRate);

    return () => clearInterval(intervalId);
  }, [score, gameStarted, isPaused]);

  useEffect(() => {
    if (!gameStarted || isPaused) return;

    const updateFallingObjects = () => {
      setFallingObjects((prevObjects) =>
        prevObjects
          .map((obj) => ({
            ...obj,
            y: obj.y + obj.speed,
          }))
          .filter((obj) => obj.y < window.innerHeight)
      );
    };

    const intervalId = setInterval(updateFallingObjects, 16);

    return () => clearInterval(intervalId);
  }, [gameStarted, isPaused]);

  useEffect(() => {
    if (!gameStarted || isPaused) return;

    const checkCollisions = () => {
      setFallingObjects((prevObjects) => {
        let newScore = score;
        const newObjects = prevObjects.filter((obj) => {
          const isColliding =
            obj.x < mouseX + cursorWidth &&
            obj.x + objectWidth > mouseX &&
            obj.y + objectHeight >= 650 &&
            obj.y < 650 + cursorHeight;

          if (isColliding) {
            newScore += 1;
            playPopSound();
          }

          return !isColliding;
        });

        if (newObjects.length !== prevObjects.length) {
          setScore(newScore);
        }

        return newObjects;
      });
    };

    const intervalId = setInterval(checkCollisions, 16);

    return () => clearInterval(intervalId);
  }, [mouseX, fallingObjects, score, gameStarted, isPaused]);

  useEffect(() => {
    if (!gameStarted || isPaused) return;

    const checkMissedObjects = () => {
      const missedObject = fallingObjects.some(
        (obj) => obj.y >= 650 && !(obj.x >= mouseX && obj.x <= mouseX + cursorWidth)
      );

      if (missedObject) {
        setScore(0); 
      }
    };

    const intervalId = setInterval(checkMissedObjects, 16);

    return () => clearInterval(intervalId);
  }, [fallingObjects, mouseX, gameStarted, isPaused]);

  useEffect(() => {
    if (gameStarted && !isPaused) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameStarted, isPaused]);

  return (
    <div className="App">
      {!gameStarted || isPaused ? (
        <StartButton onStart={startGame} isPaused={isPaused} /> // Exibe o botão de "Continuar" se pausado
      ) : (
        <>
          <h1>Pontuação: {score}</h1>
          <img
            src={cursorImage}
            alt="Cursor"
            className="custom-cursor"
            style={{ left: `${mouseX}px` }}
          />
          {fallingObjects.map((obj) => (
            <img
              key={obj.id}
              src={obj.src}
              alt="Falling object"
              className="falling-object"
              style={{ left: `${obj.x}px`, top: `${obj.y}px` }}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default App;
