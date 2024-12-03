import React, { useState, useEffect } from "react";
import "./CharacterView.css"; // Import your CSS file for styling
import image from "./assets/images/merchant.jpeg";
import backpack from "./assets/images/backpack.png";
import clothes from "./assets/images/clothes.png";
import donkey from "./assets/images/donkey.png";


function CharacterView({ api }) {
  const [equippedItems, setEquippedItems] = useState({});
  const [characterImage, setCharacterImage] = useState(null); // Placeholder

  useEffect(() => {
    // Fetch equipped items from the backend API
    api
      .get("/character/equipment") // Adjust the endpoint as needed
      .then((response) => {
        setEquippedItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching equipped items:", error);
        // Handle error, e.g., display an error message
      });

    // Fetch character image (replace with your actual logic)
    // Example:
    // api.get("/character/image")
    //   .then((response) => setCharacterImage(response.data.imageUrl))
    //   .catch((error) => /* ... */);

    // Set a default character image if fetching fails or while loading:
    setCharacterImage(
      image // Placeholder image URL
    );
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="character-view">
      <div className="character-image-container">
        <img
          src={image}
          alt="Character"
          style={{ width: "300px", height: "300px" }}
          className="character-image"
        />
      </div>

      <div className="equipment-slots">
        <button className="equipment-slot head">
          {equippedItems.head ? (
            <img src={equippedItems.head.imageUrl} alt="Head Item" />
          ) : (
            <img src={donkey} alt="Mount Item" style={{ width: "50px", height: "50px" }} />
          )}
        </button>
        <button className="equipment-slot body">
          {equippedItems.body ? (
            <img src={equippedItems.body.imageUrl} alt="Body Item" />
          ) : (
            <img src={clothes} alt="Body Item" style={{ width: "50px", height: "50px" }} />
          )}
        </button>

        <button className="equipment-slot backpack">
          {equippedItems.backpack ? (
            <img src={equippedItems.backpack.imageUrl} alt="Body Item" />
          ) : (
            <img
              src={backpack}
              alt="Backpack"
              style={{ width: "50px", height: "50px" }}
            />
          )}
        </button>
      </div>
    </div>
  );
}

export default CharacterView;
