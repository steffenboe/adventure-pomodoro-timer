import { useState, useEffect, useRef } from "react";

function useTimer(workMinutes, breakMinutes, longBreakMinutes) {
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);
  const [sessionCount, setSessionCount] = useState(0);
  const sessionCountRef = useRef(sessionCount);

  useEffect(() => {
    setSecondsLeft(workMinutes * 60);
    secondsLeftRef.current = workMinutes * 60;
    sessionCountRef.current = 1;
    setSessionCount(1);
  }, [workMinutes]);

  useEffect(() => {
    const switchMode = () => {
      const nextMode = getNextMode();
      const nextSeconds = getNextSeconds(nextMode);
      setMode(nextMode);
      modeRef.current = nextMode;
      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;

      if (nextMode === "work") {
        sessionCountRef.current = sessionCountRef.current + 1;
        setSessionCount(sessionCountRef.current);
      }

      function getNextSeconds(nextModeParam) {
        if (nextModeParam === "longBreak") {
          sessionCountRef.current = 0;
          setSessionCount(0);
          return longBreakMinutes * 60;
        }
        return (nextModeParam === "work" ? workMinutes : breakMinutes) * 60;
      }

      function getNextMode() {
        if (modeRef.current === "work" && sessionCountRef.current === 4) {
          return "longBreak";
        }
        return modeRef.current === "work" ? "break" : "work";
      }
    };

    const tick = () => {
      secondsLeftRef.current--;
      setSecondsLeft(secondsLeftRef.current);
    };

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        switchMode();
      } else {
        tick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [workMinutes, breakMinutes, longBreakMinutes]);

  const handleStart = () => {
    setIsPaused(false);
    isPausedRef.current = false;
    window.dispatchEvent(new CustomEvent("timerStart"));
  };

  const handlePause = () => {
    setIsPaused(true);
    isPausedRef.current = true;
    window.dispatchEvent(new CustomEvent("timerPause"));
  };

  return {
    isPaused,
    secondsLeft,
    mode,
    start: handleStart,
    pause: handlePause,
    sessionCount,
  };
}

export default useTimer;
