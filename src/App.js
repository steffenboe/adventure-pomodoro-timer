import AdventureMap from "./AdventureMap";
import "./App.css";
import Settings from "./Settings";
import SettingsContext from "./SettingsContext";
import Timer from "./Timer";
import { useState, useEffect, useRef } from "react";
import backgroundImage from "./assets/images/forestmountains.jpg";
import Lottie from "lottie-react";


function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [isPaused, setIsPaused] = useState(true); // Add isPaused state

  const [playerGold, setPlayerGold] = useState(0);
  const lottiefileRef = useRef(null);

  useEffect(() => {
    const handleAdventureComplete = (event) => {
      setPlayerGold((prevGold) => prevGold + event.detail.amount);
    };
  
    window.addEventListener("adventureCompleted", handleAdventureComplete);
  
    return () => {
      window.removeEventListener("adventureCompleted", handleAdventureComplete);
    };
  }, []);

  return (
    <main>
      <div style={{
        position: "absolute",
        top: -70,
        left: -30,
        zIndex: 10,
        fontSize: "20px",
      }}>
        <Lottie ref={lottiefileRef} animationData={require("./assets/lottie/coins.json")} style={{ width: "150px", height: "150px" }} loop={false} /> 
        {playerGold}        
      </div>

      <div style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",  
          width: "100vw",         
          height: "100vh",        
          position: "absolute", 
          top: 0,
          zIndex: 1,            
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
