import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useContext, useState, useEffect, useRef } from "react"
import SettingsContext from "./SettingsContext"
import AdventureMap from "./AdventureMap"

const red = "#f54e4e"
const green = "#4aec8c"

function Timer() {
  const settingsInfo = useContext(SettingsContext)

  const [isPaused, setIsPaused] = useState(true)
  const [mode, setMode] = useState('work')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const secondsLeftRef = useRef(secondsLeft)
  const isPausedRef = useRef(isPaused)
  const modeRef = useRef(mode)

  function initTimer() {
    setSecondsLeft(settingsInfo.workMinutes * 60)
    secondsLeftRef.current = settingsInfo.workMinutes * 60;
  }

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  useEffect(() => {

    function switchMode() {
      const nextMode = modeRef.current === 'work' ? 'break' : 'work';
      const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }

    initTimer()
    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    },1000)
    return () => clearInterval(interval)
  }, [settingsInfo]);

  const handleStart = () => {
    setIsPaused(false);
    isPausedRef.current = false;
    const event = new CustomEvent('timerStart');
    window.dispatchEvent(event);
  };

  const playButton = <button onClick={handleStart}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
        clipRule="evenodd" />
    </svg>
  </button>;
  const pauseButton = <button onClick={() => {setIsPaused(true); isPausedRef.current = true}}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
        clipRule="evenodd" />
    </svg>
  </button>;

  const totalSeconds = mode === 'work'  
    ? settingsInfo.workMinutes * 60 
    : settingsInfo.breakMinutes * 60
  const percentage = Math.round(secondsLeft / totalSeconds * 100)

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if(seconds < 10) seconds = '0' + seconds
    

  return (
    <div>
      <CircularProgressbar
        value={percentage}
        size={200}
        strokeWidth={10}
        radius={20}
        text={minutes + ":" + seconds}
        styles={buildStyles({
          pathColor: mode === 'work' ? green : red,
          textColor: "#fff",
          trailColor: "rgba(255, 255, 255, 0.2)",
        })}
      />
      <div style={{ marginTop: "20px" }}>
        {isPausedRef.current ? playButton : pauseButton}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button
          className="with-text"
          onClick={() => settingsInfo.setShowSettings(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
              clipRule="evenodd"
            />
          </svg>
          Settings
        </button>
      </div>
    </div>
  );
}

export default Timer;
