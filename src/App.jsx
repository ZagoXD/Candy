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
import bomb from './assets/images/bomb.png'
import double from './assets/images/x2.png'
import bubbleSoundFile from './assets/sounds/bubble.mp3';
import popSoundFile from './assets/sounds/pop.mp3';
import bombSoundFile from './assets/sounds/bomb.mp3';
import StartButton from './components/StartButton';
import NextButton from './components/NextButton';
import PauseButton from './components/PauseButton';

const fallingItems = [
  { src: bala1, type: 'candy' },
  { src: bala2, type: 'candy' },
  { src: bala3, type: 'candy' },
  { src: chicle1, type: 'candy' },
  { src: choco1, type: 'candy' },
  { src: pirulito1, type: 'candy' },
  { src: pirulito2, type: 'candy' },
  { src: pirulito3, type: 'candy' },
  { src: bomb, type: 'bomb' },
];

const levels = [
  { level: 1, requiredPoints: 5, speedMultiplier: 0.5, spawnRate: 2000 },
  { level: 2, requiredPoints: 10, speedMultiplier: 1, spawnRate: 1500 },
  { level: 3, requiredPoints: 15, speedMultiplier: 1.5, spawnRate: 1000 },
  { level: 4, requiredPoints: 20, speedMultiplier: 2, spawnRate: 800 },
  { level: 5, requiredPoints: 30, speedMultiplier: 2.5, spawnRate: 600 },
];

function App() {
  const [mouseX, setMouseX] = useState(0);
  const [score, setScore] = useState(0);
  const [fallingObjects, setFallingObjects] = useState([]);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [levelPassed, setLevelPassed] = useState(false);
  const [gamePaused, setGamePaused] = useState(false); 

  const popSound = useRef(null);
  const bombSound = useRef(null);
  const timerRef = useRef(null);
  const spawnObjectsRef = useRef(null); 

  // Função para iniciar ou continuar o jogo
  const startGame = () => {
    setIsPaused(false);
    setGameStarted(true);
    setGamePaused(false); 
    setLevelPassed(false);
    setTimeLeft(30); 
    setFallingObjects([]);
    startTimer();
    startSpawningObjects(); 
  };

  // Função para passar para o próximo nível
  const nextLevel = () => {
    setLevel(level + 1);
    setScore(0);
    setFallingObjects([]);
    setLevelPassed(false); 
    setTimeLeft(30); 

    startGame();
  };

  const resumeGame = () => {
    setGamePaused(false);
    startTimer(); 
    startSpawningObjects(); 
  };

  const unlockAudio = () => {
    if (!isAudioUnlocked) {
      popSound.current = new Audio(popSoundFile);
      bombSound.current = new Audio(bombSoundFile);
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

  const playBombSound = () => {
    if (bombSound.current) {
      bombSound.current.currentTime = 0;
      bombSound.current.play().catch((error) => {
        console.error('Erro ao tocar o som da bomba:', error);
      });
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsPaused(true); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startSpawningObjects = () => {
    if (spawnObjectsRef.current) clearInterval(spawnObjectsRef.current);
  
    const { spawnRate } = getDifficultySettings();
    spawnObjectsRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * fallingItems.length);
      const fallingItem = fallingItems[randomIndex];
      const object = {
        id: Date.now(),
        src: fallingItem.src,
        type: fallingItem.type,
        x: Math.random() * (window.innerWidth - 50),
        y: -100,
        speed: (Math.random() * 5 + 2) * getDifficultySettings().speedMultiplier,
      };
      setFallingObjects((prevObjects) => [...prevObjects, object]);
    }, spawnRate);
  };
  

  useEffect(() => {
    return () => clearInterval(spawnObjectsRef.current);
  }, []);

  useEffect(() => {
    const currentLevel = levels[level - 1];

    if (score >= currentLevel.requiredPoints && level < 5) {
      setLevelPassed(true); 
      setIsPaused(true);
      clearInterval(timerRef.current); 
      clearInterval(spawnObjectsRef.current); 
    } else if (level === 5 && timeLeft === 0) {

      alert(`Parabéns! Você completou o jogo. Sua pontuação final foi: ${score}`);
      resetGame();
    } else if (timeLeft === 0 && score < currentLevel.requiredPoints) {

      alert(`Você não atingiu a pontuação mínima de ${currentLevel.requiredPoints} pontos. O nível será reiniciado.`);
      restartLevel();
    }
  }, [score, level, timeLeft]);

  const restartLevel = () => {
    setScore(0); 
    setTimeLeft(30); 
    setFallingObjects([]);
    startTimer(); 
    startSpawningObjects();

    startGame();
  };

  const resetGame = () => {
    setGameStarted(false);
    setLevel(1);
    setScore(0);
    setFallingObjects([]); 
    setTimeLeft(30);
    clearInterval(spawnObjectsRef.current);
  };

  // Pausar o jogo ao pressionar "Esc"
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && gameStarted && !gamePaused) {
        setGamePaused(true); 
        clearInterval(timerRef.current); 
        clearInterval(spawnObjectsRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted, gamePaused]);

  const cursorWidth = 70;
  const cursorHeight = 70;
  const objectWidth = 50;
  const objectHeight = 50;

  const handleMouseMove = (event) => {
    const maxX = window.innerWidth - cursorWidth;
    setMouseX(Math.min(event.clientX, maxX));
    unlockAudio();
  };

  const getDifficultySettings = () => {
    return levels[level - 1]; // Retorna as configurações do nível atual
  };

  useEffect(() => {
    if (!gameStarted || isPaused || levelPassed || gamePaused) return;

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
  }, [gameStarted, isPaused, levelPassed, gamePaused]);

  // Verifica a colisão entre o cursor e os objetos
  useEffect(() => {
    if (!gameStarted || isPaused || levelPassed || gamePaused) return;
  
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
            if (obj.type === 'candy') {
              newScore += 1; 
              playPopSound();
            } else if (obj.type === 'bomb') {
              newScore = Math.max(newScore - 1, 0); 
              playBombSound();
            }
          }
  
          return !isColliding; 
        });
  
        setScore(newScore);
        return newObjects;
      });
    };
  
    const intervalId = setInterval(checkCollisions, 16);
  
    return () => clearInterval(intervalId);
  }, [mouseX, fallingObjects, gameStarted, isPaused, levelPassed, gamePaused]);
  

  useEffect(() => {
    if (!gameStarted) return;

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameStarted]);

  return (
    <div className="App">
      {!gameStarted ? (
        <StartButton onStart={startGame} />
      ) : gamePaused ? (
        <PauseButton onResume={resumeGame} />
      ) : levelPassed ? (
        <NextButton onNext={nextLevel} />
      ) : (
        <>
          <div className="score-container">
            <h1 className="score">Pontuação: {score}</h1>
            <h1 className="level">Nível: {level}</h1>
            <h1 className="time-left">Tempo restante: {timeLeft}s</h1>
          </div>
          <img src={cursorImage} alt="Cursor" className="custom-cursor" style={{ left: `${mouseX}px` }} />
          {fallingObjects.map((obj) => (
            <img key={obj.id} src={obj.src} alt="Falling object" className="falling-object" style={{ left: `${obj.x}px`, top: `${obj.y}px` }} />
          ))}
        </>
      )}
    </div>
  );
  
}

export default App;
