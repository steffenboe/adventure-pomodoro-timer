import { motion, useMotionValue, useAnimationControls } from "framer-motion";
import { useEffect, useContext, useRef, useState } from "react";
import backgroundImage from "./assets/images/mountains.jpg"; // Import your background image
import SettingsContext from "./SettingsContext";
import lottieFile from "./assets/images/bus.json";
import Lottie from "lottie-react";

function AdventureMap() {
  const settingsInfo = useContext(SettingsContext);

  const transition = {
    // duration: (settingsInfo.workMinutes * 60) / 4,
    duration: 20,
    ease: "linear",
  };
  const straightPath = "M100,600 L400,500 L220,310 L400,230 L120,130";

  const animationControls = useAnimationControls();
  const svgContainerControls = useAnimationControls();

  useEffect(() => {
    const handleTimerStart = () => {
      svgContainerControls.start({ x: "-700px" }); // Adjust scroll distance
      animationControls.stop();
      animationControls.start({ offsetDistance: "100%" });
    };

    const handleTimerPause = () => {
      animationControls.stop();
      svgContainerControls.stop();
    };

    const handleTimePass = (event) => {
      console.log("Seconds left from event:", event.detail.secondsLeft); // Access data from event.detail
    }

    // Add event listeners for timerStart and timerPause
    window.addEventListener("timerStart", handleTimerStart);
    window.addEventListener("timerPause", handleTimerPause); // Add this line

    return () => {
      window.removeEventListener("timerStart", handleTimerStart);
      window.removeEventListener("timerPause", handleTimerPause); // And this line
    };
  }, []);

  return (
    <div>
      {/* <motion.div
        animate={svgContainerControls}
        transition={{
          duration: (settingsInfo.workMinutes * 60) / 4,
          ease: "linear",
        }}
        style={{
          width: "100%",
          height: "300px",
          overflow: "hidden",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom", // Align to bottom
        }}
      ></motion.div> */}
      <svg width="100%" height="700px" style={{ position: "absolute", top: 0, left: -50, zIndex: 0, pointerEvents: 'none' }}> {/* pointerEvents makes it non-interactive */}
        <path d={straightPath} stroke="white" strokeWidth="2" fill="none" />
      </svg>
      {/* <motion.div
        animate={animationControls}
        transition={transition}
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "10px",
          position: "absolute",
          top: 0,
          left: -50,
          offsetPath: `path('${straightPath}')`,
        }}
      >
        <Lottie animationData={lottieFile} /> 
      </motion.div>  */}

      <motion.div
          animate={animationControls}
          transition={transition}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "10px",
            position: "absolute",
            background: "white",
            top: 0,
            left: -50,
            offsetPath: `path('${straightPath}')`,
          }}
        />
    </div>
  );
}

export default AdventureMap;
