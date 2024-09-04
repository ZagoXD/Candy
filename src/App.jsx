import React, { useState, useEffect } from 'react';
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

const fallingItems = [bala1, bala2, bala3, chicle1, choco1, pirulito1, pirulito2, pirulito3];

function App() {
  const [mouseX, setMouseX] = useState(0);
  const [score, setScore] = useState(0);
  const [fallingObjects, setFallingObjects] = useState([]);

  const cursorWidth = 70;
  const cursorHeight = 70;
  const objectWidth = 50;
  const objectHeight = 50;

  const handleMouseMove = (event) => {
    const maxX = window.innerWidth - cursorWidth;
    setMouseX(Math.min(event.clientX, maxX));
  };

  const getDifficultySettings = (currentScore) => {
    if (currentScore <= 5) {
      return { speedMultiplier: 0.2, spawnRate: 3000 }; 
    } else if (currentScore <= 10) {
      return { speedMultiplier: 0.7, spawnRate: 2000 };
    } else if (currentScore <= 15) {
      return { speedMultiplier: 1.2, spawnRate: 1000 };
    } else {
      return { speedMultiplier: 2, spawnRate: 500 }; 
    }
  };

  useEffect(() => {
    const { spawnRate } = getDifficultySettings(score);

    const createFallingObject = () => {
      const randomIndex = Math.floor(Math.random() * fallingItems.length);
      const object = {
        id: Date.now(),
        src: fallingItems[randomIndex],
        x: Math.random() * (window.innerWidth - objectWidth), 
        y: -100, // Posição Y inicial (fora da tela)
        speed: (Math.random() * 5 + 2) * getDifficultySettings(score).speedMultiplier, // Velocidade de queda ajustada pela dificuldade
      };
      setFallingObjects((prevObjects) => [...prevObjects, object]);
    };

    const intervalId = setInterval(createFallingObject, spawnRate);

    return () => clearInterval(intervalId);
  }, [score]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
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
          }

          return !isColliding; // Remove os objetos que colidiram
        });

        // Atualiza a pontuação se houve colisões
        if (newObjects.length !== prevObjects.length) {
          setScore(newScore);
        }

        return newObjects;
      });
    };

    const intervalId = setInterval(checkCollisions, 16);

    return () => clearInterval(intervalId);
  }, [mouseX, fallingObjects, score]);

  // Função para zerar a pontuação se algum objeto passar da linha Y=650 sem colidir
  useEffect(() => {
    const resetScoreOnMiss = () => {
      const missedObject = fallingObjects.some(
        (obj) => obj.y >= 650 && !(obj.x >= mouseX && obj.x <= mouseX + cursorWidth)
      );

      if (missedObject) {
        setScore(0);
      }
    };

    const intervalId = setInterval(resetScoreOnMiss, 16);

    return () => clearInterval(intervalId);
  }, [fallingObjects, mouseX]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="App">
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
    </div>
  );
}

export default App;