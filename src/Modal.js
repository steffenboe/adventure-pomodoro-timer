import React, { useState, useEffect } from 'react';

function Modal({ onClose, children }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose(); // Call the onClose function after the modal disappears
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, [onClose]);


  if (!isVisible) {
    return null; // Don't render anything if not visible
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px', // Position at the bottom
        right: '20px',  // Position to the right
        backgroundColor: 'black',
        padding: '10px 20px', // Adjusted padding
        borderRadius: '8px',
        textAlign: 'center',
        zIndex: 100,
        opacity: isVisible ? 1 : 0, // Fade out animation
        transition: 'opacity 0.5s ease', // Smooth transition
      }}
      onClick={onClose}
    >
       {children}      
    </div>
  );
}

export default Modal;
