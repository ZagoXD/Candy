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
import bomb from './assets/images/bomb.png';
import double from './assets/images/x2.png';
import clock from './assets/images/incTime.png';
import { Howl, Howler } from 'howler';
import popSoundFile from './assets/sounds/pop.mp3';
import bombSoundFile from './assets/sounds/bomb.mp3';
import bubbleSoundFile from './assets/sounds/bubble.mp3';
import clockSoundFile from './assets/sounds/clock.mp3';
import passPhaseSoundFile from './assets/sounds/passphase.mp3';
import songSoundFile from './assets/sounds/song.mp3';
import winSoundFile from './assets/sounds/winSound.mp3';
import loseSoundFile from './assets/sounds/loseSound.mp3';
import StartButton from './components/StartButton';
import NextButton from './components/NextButton';
import PauseButton from './components/PauseButton';
import WinButton from './components/WinButton';
import RetryButton from './components/RetryButton';
import SettingsIcon from '@mui/icons-material/Settings';
import bgImage from './assets/images/bg.png'; // Importa a imagem de fundo

const backgroundMusic = new Howl({
  src: [songSoundFile],
  loop: true,
});

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
  { src: clock, type: 'clock' }
];

const levels = [ //dados levels
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
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [levelPassed, setLevelPassed] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [isDoublePointsActive, setIsDoublePointsActive] = useState(false);
  const doublePointsTimeout = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [levelFailed, setLevelFailed] = useState(false);
  const cursorRef = useRef(null);
  const [cursorDimensions, setCursorDimensions] = useState({ width: 70, height: 70 });
  const [objectDimensions, setObjectDimensions] = useState({ width: 50, height: 50 });
  const [loading, setLoading] = useState(true);

  const preloadAssets = async () => {
    const images = [
      bala1, bala2, bala3, chicle1, choco1, pirulito1, pirulito2, pirulito3, bomb, clock,
      bgImage // Carrega a imagem de fundo
    ];
    
    const sounds = [popSoundFile, bombSoundFile, bubbleSoundFile, clockSoundFile, passPhaseSoundFile, winSoundFile, loseSoundFile, songSoundFile];
  
    // Função para carregar imagens
    const loadImages = images.map(src => new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject; // Adiciona tratamento de erro
    }));
  
    // Função para carregar sons
    const loadSounds = sounds.map(src => new Promise((resolve, reject) => {
      const sound = new Howl({
        src: [src],
        onload: resolve,
        onloaderror: reject, // Adiciona tratamento de erro
      });
    }));
  
    try {
      await Promise.all([...loadImages, ...loadSounds]);
      setLoading(false); // Define o carregamento como concluído
    } catch (error) {
      console.error('Erro no carregamento de recursos:', error);
    }
  };
  
  
  useEffect(() => {
    const loadGameAssets = async () => {
      await preloadAssets();
      setLoading(false); // Certifique-se de que isso seja chamado quando tudo for carregado
    };
    
    loadGameAssets();
  }, []);
  
  const toggleMusic = () => {
    if (isMusicPlaying) {
      backgroundMusic.pause();
    } else {
      backgroundMusic.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  useEffect(() => {
    backgroundMusic.play(); // Toca a música ao carregar
    return () => {
      backgroundMusic.stop(); // Para a música quando o componente for desmontado
    };
  }, []);

  const timerRef = useRef(null);
  const spawnObjectsRef = useRef(null);

  // Inicializa os sons usando Howler.js
  const popSound = useRef(null);
  const bombSound = useRef(null);
  const bubbleSound = useRef(null);
  const clockSound = useRef(null);
  const passPhaseSound = useRef(null); 
  const winSound = useRef(null);
  const loseSound = useRef(null);

  const initializeSounds = () => {
    popSound.current = new Howl({ src: [popSoundFile] });
    bombSound.current = new Howl({ src: [bombSoundFile] });
    bubbleSound.current = new Howl({ src: [bubbleSoundFile] });
    clockSound.current = new Howl({ src: [clockSoundFile] });
    passPhaseSound.current = new Howl({ src: [passPhaseSoundFile] }); 
    winSound.current = new Howl({ src: [winSoundFile] });
    loseSound.current = new Howl({ src: [loseSoundFile] });
  };

  const startGame = () => {
    // Retoma o AudioContext se ele estiver suspenso
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume().then(() => {
        console.log("AudioContext resumed");
        backgroundMusic.play();
      }).catch((error) => {
        console.error("Failed to resume AudioContext:", error);
      });
    } else {
      // nada
    }
 
    initializeSounds(); 
    setIsPaused(false);
    setGameStarted(true);
    setGamePaused(false);
    setLevelPassed(false);
    setTimeLeft(30);
    setFallingObjects([]);
    startTimer();
    startSpawningObjects();
  };

  const nextLevel = () => {
   // passPhaseSound.current.play(); 

    setLevel(level + 1);
    setScore(0);
    setFallingObjects([]);
    setLevelPassed(false);
    setIsDoublePointsActive(false);
    setTimeLeft(30);

    startGame();
  };

  const resumeGame = () => {
    setGamePaused(false);
    startTimer();
    startSpawningObjects();
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
      const shouldGenerateDouble = Math.random() < 0.08; // 8% chance vir double
      const shouldGenerateClock = Math.random() < 0.04; // 4% chance vir relogio

      let fallingItem;

      // Prioriza a geração do clock se a condição for verdadeira
      if (shouldGenerateClock) {
        fallingItem = { src: clock, type: 'clock' };
      } else if (shouldGenerateDouble && !isDoublePointsActive) {
        fallingItem = { src: double, type: 'double' };
      } else {
        fallingItem = fallingItems[Math.floor(Math.random() * fallingItems.length)];
      }

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
      setGameWon(true); // Jogador venceu
    } else if (timeLeft === 0 && score < currentLevel.requiredPoints) {
      setLevelFailed(true); // Jogador falhou no nível
    }
  }, [score, level, timeLeft]);

  const retryLevel = () => {
    setScore(0);
    setTimeLeft(30);
    setFallingObjects([]);
    setLevelFailed(false); 
    startTimer();
    startSpawningObjects();
    startGame(); 
  };

  const restartGame = () => {
    setGameStarted(false);
    setLevel(1);
    setScore(0);
    setFallingObjects([]);
    setTimeLeft(30);
    setGameWon(false);
    clearInterval(spawnObjectsRef.current);
  };

  // const restartLevel = () => {
  //   setScore(0);
  //   setTimeLeft(30);
  //   setFallingObjects([]);
  //   startTimer();
  //   startSpawningObjects();
  //   startGame();
  // };

  // const resetGame = () => {
  //   setGameStarted(false);
  //   setLevel(1);
  //   setScore(0);
  //   setFallingObjects([]);
  //   setTimeLeft(30);
  //   clearInterval(spawnObjectsRef.current);
  // };

  const pauseGame = () =>{
    popSound.current.play(); 
    setGamePaused(true);
    clearInterval(timerRef.current);
    clearInterval(spawnObjectsRef.current);
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && gameStarted && !gamePaused) {
        popSound.current.play(); 
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
  // const cursorHeight = 70;
  // const objectWidth = 50;
  // const objectHeight = 50;

  const getDifficultySettings = () => {
    return levels[level - 1];
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

  const calculateCursorY = () => {
    return window.innerHeight * 0.77;
  };

  // Ajuste dinâmico das dimensões com base no tamanho da tela
  const updateDimensions = () => {
    const width = window.innerWidth;

    // Ajuste as dimensões do cursor e dos objetos caindo com base no tamanho da tela
    const newCursorDimensions = width < 768 ? { width: 50, height: 50 } : { width: 70, height: 70 };
    const newObjectDimensions = width < 768 ? { width: 30, height: 30 } : { width: 50, height: 50 };

    setCursorDimensions(newCursorDimensions);
    setObjectDimensions(newObjectDimensions);
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleMouseMove = (event) => {
    const maxX = window.innerWidth - cursorDimensions.width;
    setMouseX(Math.min(event.clientX, maxX));
  };

  useEffect(() => {
    if (!gameStarted || isPaused || levelPassed || gamePaused) return;

    const checkCollisions = () => {
      setFallingObjects((prevObjects) => {
        let newScore = score;
        let newTimeLeft = timeLeft; 
  
        const cursorY = calculateCursorY();
  
        const newObjects = prevObjects.filter((obj) => {
          const isColliding =
            obj.x < mouseX + cursorDimensions.width &&
            obj.x + objectDimensions.width > mouseX &&
            obj.y + objectDimensions.height >= cursorY &&
            obj.y < cursorY + cursorDimensions.height;
  
          if (isColliding) {
            if (obj.type === 'candy') {
              newScore += isDoublePointsActive ? 2 : 1;
              popSound.current.play();
            } else if (obj.type === 'bomb') {
              newScore = Math.max(newScore - 1, 0);
              newTimeLeft = Math.max(newTimeLeft - 5, 0); 
              bombSound.current.play();
            } else if (obj.type === 'double') {
              setIsDoublePointsActive(true);
              bubbleSound.current.play();
              clearTimeout(doublePointsTimeout.current);
              doublePointsTimeout.current = setTimeout(() => {
                setIsDoublePointsActive(false);
              }, 10000);
            } else if (obj.type === 'clock') {
              newTimeLeft += 15;
              clockSound.current.play();
            }
  
            return false; 
          }
          return true; 
        });
  
        setScore(newScore);
        setTimeLeft(newTimeLeft); 
        return newObjects;
      });
    };

    const intervalId = setInterval(checkCollisions, 16);

    return () => clearInterval(intervalId);
  }, [mouseX, fallingObjects, gameStarted, isPaused, levelPassed, gamePaused, isDoublePointsActive, timeLeft]);

  useEffect(() => {
    if (gameWon) {
      winSound.current.play(); // Toca o som de vitória
    }
  }, [gameWon]);
  
  useEffect(() => {
    if (levelFailed) {
      loseSound.current.play(); // Toca o som de falha
    }
  }, [levelFailed]);

  useEffect(() => {
    if (levelPassed) {
      passPhaseSound.current.play(); // Toca o som de passar de fase
    }
  }, [levelPassed]);

  useEffect(() => {
    return () => {
      if (passPhaseSound.current) {
        passPhaseSound.current.unload();
      }
      if (popSound.current) {
        popSound.current.unload();
      }
      if (bombSound.current) {
        bombSound.current.unload();
      }
      if (bubbleSound.current) {
        bubbleSound.current.unload();
      }
      if (clockSound.current) {
        clockSound.current.unload();
      }
    };
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };

    
  }, [gameStarted]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const maxX = window.innerWidth - cursorWidth;
      setMouseX(Math.min(event.clientX, maxX));
    };
  
    const handleTouchMove = (event) => {
      const touchX = event.touches[0].clientX;
      const maxX = window.innerWidth - cursorWidth;
      setMouseX(Math.min(touchX, maxX));
    };
  
    const handleTouchStart = () => {
      // Nada por enquanto
    };
  
    const handleTouchEnd = () => {
      // Nada por enquanto
    };
  
    if (gameStarted) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchend', handleTouchEnd);
    }
  
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameStarted]);
    
  return (
    <div className="App">
      {loading ? (
        <div className="loading-screen">
          <h1>Carregando...</h1>
        </div>
      ) : !gameStarted ? (
        <StartButton onStart={startGame} toggleMusic={toggleMusic} isMusicPlaying={isMusicPlaying} />
      ) : gamePaused ? (
        <PauseButton onResume={resumeGame} toggleMusic={toggleMusic} isMusicPlaying={isMusicPlaying} />
      ) : levelPassed ? (
        <NextButton onNext={nextLevel} toggleMusic={toggleMusic} isMusicPlaying={isMusicPlaying} />
      ) : gameWon ? (
        <WinButton onRestart={restartGame} score={score} />
      ) : levelFailed ? (
        <RetryButton onRetry={retryLevel} level={level} />
      ) : (
        <>
          <div className='container'>
            <div className="score-container">
              <h1 className="score">Pontuação: {score} {isDoublePointsActive && <span className="double-points">X2</span>}</h1>
              <h1 className="level">Nível: {level}</h1>
              <h1 className="time-left">Tempo restante: {timeLeft}s</h1>
            </div>
            <button className='btnPausar' onClick={pauseGame}><SettingsIcon className="settings-icon" /></button>
          </div>
          <img src={cursorImage} alt="Cursor" className="custom-cursor" ref={cursorRef} style={{ left: `${mouseX}px` }} />
          {fallingObjects.map((obj) => (
            <img key={obj.id} src={obj.src} alt="Falling object" className="falling-object" style={{ left: `${obj.x}px`, top: `${obj.y}px` }} />
          ))}
        </>
      )}
    </div>
  );
}

export default App;
