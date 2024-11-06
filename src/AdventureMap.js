import { motion, useMotionValue, useAnimationControls } from "framer-motion";
import { useEffect, useContext, useRef, useState } from "react";
import backgroundImage from "./assets/images/mountains.jpg"; // Import your background image
import SettingsContext from "./SettingsContext";


function AdventureMap() {

  const settingsInfo = useContext(SettingsContext);

  const transition = { duration: (settingsInfo.workMinutes * 60) / 4, ease: "linear" };
  const straightPath = "M100,320 L460,320";

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
      <motion.div
        animate={svgContainerControls}
        transition={{ duration: (settingsInfo.workMinutes * 60) / 4, ease: "linear" }}
        style={{
          width: "100%",
          height: "300px",
          overflow: "hidden",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom", // Align to bottom
        }}
      >
        
      </motion.div>
      <motion.div
          animate={animationControls}
          transition={transition}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "10px",
            position: "relative",
            background: "white",
            top: -200,
            left: -50,
            transform: "translateY(-150px)", // Adjust vertical offset here
            offsetPath: `path('${straightPath}')`,
          }}
        />
    </div>
  );
}

export default AdventureMap;
