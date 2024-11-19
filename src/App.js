import AdventureMap from "./AdventureMap";
import "./App.css";
import Settings from "./Settings";
import SettingsContext from "./SettingsContext";
import Timer from "./Timer";
import { useState, useEffect, useRef } from "react";
import backgroundImage from "./assets/images/forestmountains.jpg";
import coinsImage from './assets/images/coins.png'; 
import Modal from './Modal';


function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);

  const [playerGold, setPlayerGold] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalGoldAmount, setModalGoldAmount] = useState(0);


  useEffect(() => {
    const handleAdventureComplete = (event) => {
      setPlayerGold((prevGold) => prevGold + event.detail.amount);
      setModalGoldAmount(event.detail.amount)
      setShowModal(true);
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
        alignItems: "center",
        display: "flex",
        right: "20px",
        top: "10px",
        zIndex: 10,
        fontSize: "30px",
      }}>
        <img style={{width: "60px", height: "60px"}} src={coinsImage} alt="Coins" />
        {playerGold}        
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          Congratulations! You earned {modalGoldAmount} gold!
        </Modal>
      )}

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
