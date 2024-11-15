import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useContext, useState, useEffect, useRef } from "react";
import SettingsContext from "./SettingsContext";

const red = "#9E8C98";
const green = "#4aec8c";

function Timer() {
  const settingsInfo = useContext(SettingsContext);

  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);
  const [sessionCount, setSessionCount] = useState(0);
  const sessionCountRef = useRef(sessionCount);

  function initTimer() {
    setSecondsLeft(settingsInfo.workMinutes * 60);
    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    sessionCountRef.current = 1;
  }

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  useEffect(() => {
    function switchMode() {
      const nextMode = getNextMode();
      const nextSeconds = getNextSeconds();

      setMode(nextMode);
      if (nextMode == "work") {
        sessionCountRef.current++;
        setSessionCount(sessionCountRef.current);
        console.log(sessionCountRef.current);
      }
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;

      function getNextSeconds() {
        if (nextMode === "longBreak") {
          sessionCountRef.current = 0;
          setSessionCount(0);
          return settingsInfo.longBreakMinutes * 60;
        }
        return (
          (nextMode === "work"
            ? settingsInfo.workMinutes
            : settingsInfo.breakMinutes) * 60
        );
      }

      function getNextMode() {
        if (modeRef.current === "work" && sessionCountRef.current == 4) {
          sessionCountRef.current = 1;
          setSessionCount(1);
          return "longBreak";
        }
        return modeRef.current === "work" ? "break" : "work";
      }
    }

    initTimer();
    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [settingsInfo]);

  const handleStart = () => {
    setIsPaused(false);
    isPausedRef.current = false;
    const event = new CustomEvent("timerStart");
    window.dispatchEvent(event);
  };

  const handlePause = () => {
    setIsPaused(true);
    isPausedRef.current = true;
    const event = new CustomEvent("timerPause");
    window.dispatchEvent(event);
  };

  const playButton = (
    <button onClick={handleStart}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
  const pauseButton = (
    <button onClick={handlePause}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
      >
        <path
          fillRule="evenodd"
          d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );

  const totalSeconds =
    mode === "longBreak"
      ? settingsInfo.longBreakMinutes * 60
      : mode === "work"
      ? settingsInfo.workMinutes * 60
      : settingsInfo.breakMinutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  const renderSessionCircles = () => {
    const circles = [];
    for (let i = 0; i < 4; i++) {
      circles.push(
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: i < sessionCountRef.current ? red : "lightgray", // Green if i < sessionCount
            margin: "2px",
            display: "inline-block",
          }}
        />
      );
    }
    return circles;
  };

  return (
    <div
      style={{
        maxWidth: "120px",
        paddingTop: "250px",
        paddingLeft: "50px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        {renderSessionCircles()}
      </div>
      <CircularProgressbar
        value={percentage}
        size={50}
        strokeWidth={10}
        radius={10}
        text={minutes + ":" + seconds}
        styles={buildStyles({
          pathColor: mode === "work" ? red : green,
          textColor: "#fff",
          trailColor: "rgba(255, 255, 255, 0.2)",
        })}
      />
      <div style={{ marginTop: "20px" }}>
        {isPausedRef.current ? playButton : pauseButton}
      </div>{" "}
      <div style={{ marginTop: "10px" }}>
        <button
          className="with-text"
          style={{ padding: "5px 10px", fontSize: "12px" }}
          onClick={() => settingsInfo.setShowSettings(true)}
        >
          Settings
        </button>
      </div>
    </div>
  );
}

export default Timer;
