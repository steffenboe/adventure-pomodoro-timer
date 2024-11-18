import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useContext, useRef } from "react";
import SettingsContext from "./SettingsContext";
import useTimer from "./useTimer"; 

const red = "#9E8C98";
const green = "#4aec8c";

function Timer() {
  const settingsInfo = useContext(SettingsContext);

  const { 
    isPaused, 
    secondsLeft, 
    mode, 
    start, 
    pause,
    sessionCount
  } = useTimer(
    settingsInfo.workMinutes,
    settingsInfo.breakMinutes,
    settingsInfo.longBreakMinutes
  );

  const isPausedRef = useRef(isPaused);  // Create a ref for isPaused
  const sessionCountRef = useRef(sessionCount);

  const playButton = (
    <button onClick={start}>
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
    <button onClick={pause}>
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
            backgroundColor: i < sessionCount ? red : "lightgray", // Green if i < sessionCount
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
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
       <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        {renderSessionCircles()}
      </div>
      <CircularProgressbar
        value={percentage}
        text={minutes + ":" + seconds}
        styles={buildStyles({
          pathColor: mode === "work" ? red : green,
          textColor: "#fff",
          trailColor: "rgba(255, 255, 255, 0.2)",
        })}
      />
      <div style={{ marginTop: "20px" }}>
        {isPaused ? playButton : pauseButton} {/* Use isPaused directly */}
      </div>
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
