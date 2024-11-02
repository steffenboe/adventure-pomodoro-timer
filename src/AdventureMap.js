import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import backgroundImage from './assets/images/forest1.jpeg'; // Import your background image


function AdventureMap() {

  const [characterPositionX, setCharacterPositionX] = useState(140);
  const [characterPositionY, setCharacterPositionY] = useState(-190); 
  const [animationDuration, setAnimationDuration] = useState(0);

  useEffect(() => {
    const handleTimerStart = () => {
      setAnimationDuration(5)
      setCharacterPositionX(440)
      setCharacterPositionY(-300)
    };

    window.addEventListener('timerStart', handleTimerStart);

    return () => {
      window.removeEventListener('timerStart', handleTimerStart);
    };
  }, []);

  return (
    <div style={{ 
      backgroundImage: `url(${backgroundImage})`, // Set the background image
      backgroundSize: 'cover', // Adjust background size as needed
      backgroundPosition: 'center', // Adjust background position as needed
      width: '100%', // Ensure the background covers the entire div
      height: '90%' // Ensure the background covers the entire div
    }}>
      <motion.div
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: "blue",
          position: "absolute",
          left: 0,
          top: "50%"
        }}
        animate={{
          x: characterPositionX,
          y: characterPositionY,
        }}
        transition={{
          duration: animationDuration,
        }}
      />
    </div>
  );
}

export default AdventureMap;
