import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { exp } from "three/webgpu";

function AdventureMap({ api }) {
  const adventureDuration = 100 * 60;

  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  const [totalAnimationDuration] = useState(adventureDuration);
  let remainingAnimationTime = 0;

  let transition = {
    ease: "linear",
  };

  const straightPath = "M100,600 L400,500 L220,310 L400,230 L120,130";

  const animationControls = useAnimationControls();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        api.get("/progress").then((response) => {
          const savedProgress = response.data.progress || 0;

          progressRef.current = savedProgress;
          setProgress(savedProgress);

          animationControls.start({
            offsetDistance: `${savedProgress * 100}%`,
            transition: { duration: 0 },
          });
        });
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();

    const handleTimerStart = () => {
      remainingAnimationTime =
        totalAnimationDuration * (1 - progressRef.current);
      animationControls.stop();
      animationControls.start({
        offsetDistance: "100%",
        transition: { ease: "linear", duration: remainingAnimationTime },
      });
    };

    const handleTimerPause = async () => {
      animationControls.stop();
      try {
        api
          .put("/progress", progressRef.current)
          .catch((error) => {
            console.error("Error sending progress:", error);
          });
      } catch (error) {
        console.error("Error sending progress:", error);
      }
    };

    window.addEventListener("timerStart", handleTimerStart);
    window.addEventListener("timerPause", handleTimerPause); // Add this line

    return () => {
      window.removeEventListener("timerStart", handleTimerStart);
      window.removeEventListener("timerPause", handleTimerPause); // And this line
    };
  }, []);

  return (
    <div>
      <svg
        width="100%"
        height="100vh"
        style={{
          position: "fixed",
          top: 0,
          left: -50,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <path d={straightPath} stroke="lightgray" strokeWidth="2" fill="none" />
      </svg>
      <motion.div
        animate={animationControls}
        transition={transition}
        onUpdate={(latest) => {
          const currentProgress =
            parseFloat(latest.offsetDistance.replace("%", "")) / 100;
          progressRef.current = currentProgress;
          setProgress(currentProgress);

          if (progressRef.current >= 1) {
            const adventureCompletedEvent = new CustomEvent(
              "adventureCompleted",
              {
                detail: {
                  amount: Math.floor(Math.random() * 26) + 5,
                  exp: Math.floor(Math.random() * 26) + 5,
                },
              }
            );
            window.dispatchEvent(adventureCompletedEvent);
          }
        }}
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "10px",
          position: "absolute",
          background: "white",
          zIndex: 0,
          top: 0,
          left: -50,
          offsetPath: `path('${straightPath}')`,
        }}
      />
    </div>
  );
}

export default AdventureMap;
