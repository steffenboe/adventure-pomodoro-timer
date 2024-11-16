import AdventureMap from "./AdventureMap";
import "./App.css";
import Settings from "./Settings";
import SettingsContext from "./SettingsContext";
import Timer from "./Timer";
import { useState } from "react";
import backgroundImage from "./assets/images/forestmountains.jpg";


function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [isPaused, setIsPaused] = useState(true); // Add isPaused state

  return (
    <main>
      <div style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",  // Prevent content from overflowing
          width: "100vw",         // Fill parent width
          height: "100vh",        // Fill parent height
          position: "absolute", 
          top: 0,
          zIndex: 1,            // Ensure it's behind the timer
        }}
>
        <SettingsContext.Provider
          value={{
            showSettings,
            setShowSettings,
            workMinutes,
            breakMinutes,
            longBreakMinutes,
            setWorkMinutes,
            setBreakMinutes,
            setLongBreakMinutes,
          }}
        >
          <AdventureMap /> 
          {showSettings ? <Settings /> : <Timer />}
        </SettingsContext.Provider>
      </div>
    </main>
  );
}

export default App;
