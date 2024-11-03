import { motion, useMotionValue, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import backgroundImage from "./assets/images/map1.jpeg"; // Import your background image

function AdventureMap() {
  const [isAnimating, setIsAnimating] = useState(false);
  const transition = { duration: 5, ease: "linear" };
  const path = "M100,320 Q200,250 250,150 Q300,100 460,270";

  const animationControls = useAnimationControls();
  

  useEffect(() => {
    const handleTimerStart = () => {
      animationControls.stop();
      animationControls.start({ offsetDistance: "100%" });
    };

    const handleTimerPause = () => {
      animationControls.stop();
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
    <div
      // style={{
      //   backgroundImage: `url(${backgroundImage})`, // Set the background image
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   width: "100%",
      //   height: "90%",
      // }}
    >
      <div style={{ width: "100%", height: "380px" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"}>
          <image
            href={backgroundImage} // Use the imported image
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMax slice" // Adjust as needed
          />
          <motion.path
            d="M100,320 Q200,250 250,150 Q300,100 460,270"
            fill="transparent"
            strokeWidth="12"
            stroke="rgba(255, 255, 255, 0.69)"
            strokeLinecap="round"
            initial={{ pathLength: 1 }}
            //animate={{ pathLength: 1 }}wh
            transition={transition}
          />
        </svg>
        <motion.div
          animate={animationControls}
          transition={transition}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "10px",
            position: "absolute",
            background: "white",
            top: 50,
            offsetPath: `path('${path}')`,
          }}
        />
      </div>
    </div>
  );
}

export default AdventureMap;
