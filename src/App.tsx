import React, { useState, useEffect, useRef } from 'react';

const App: React.FC = () => {
  const [breakLength, setBreakLength] = useState<number>(5);
  const [sessionLength, setSessionLength] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [timerLabel, setTimerLabel] = useState<string>('Session');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleBreakDecrement = () => {
    if (!isRunning && breakLength > 1) {
      setBreakLength((prev) => prev - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (!isRunning && breakLength < 60) {
      setBreakLength((prev) => prev + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (!isRunning && sessionLength > 1) {
      setSessionLength((prev) => prev - 1);
      if (timerLabel === 'Session') {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const handleSessionIncrement = () => {
    if (!isRunning && sessionLength < 60) {
      setSessionLength((prev) => prev + 1);
      if (timerLabel === 'Session') {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            if (audioRef.current) {
              audioRef.current.play();
            }
            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              setTimerLabel('Session');
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timerLabel, breakLength, sessionLength]);

  return (
    <div className="pomodoro-container">
      <div className="length-control">
        <div id="break-label">Break Length</div>
        <button id="break-decrement" onClick={handleBreakDecrement}>
          -
        </button>
        <div id="break-length">{breakLength}</div>
        <button id="break-increment" onClick={handleBreakIncrement}>
          +
        </button>
      </div>

      <div className="length-control">
        <div id="session-label">Session Length</div>
        <button id="session-decrement" onClick={handleSessionDecrement}>
          -
        </button>
        <div id="session-length">{sessionLength}</div>
        <button id="session-increment" onClick={handleSessionIncrement}>
          +
        </button>
      </div>

      <div className="timer-section">
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <div className="controls">
          <button id="start_stop" onClick={handleStartStop}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button id="reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
};

export default App;
