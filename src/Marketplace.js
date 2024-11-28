import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import "./Marketplace.css";

function Marketplace({ playerGold, updatePlayerGold }) {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [modalGoldAmount, setModalGoldAmount] = useState(0);
  const [error, setError] = useState(null);
  const [createItemError, setCreateItemError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:8080/marketplace");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Error fetching items from the marketplace.");
    }
  };

  const handleBuy = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:8080/marketplace/${item.id}/buy`,
        { method: "POST" }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      updatePlayerGold();
      setModalGoldAmount(item.price);
      setShowBuyModal(true);
      fetchItems();
    } catch (error) {
      console.error("Error buying item:", error);
      setError("Error purchasing item. Please try again later.");
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const newItem = { name: newItemName, price: parseInt(newItemPrice) };
      const response = await fetch(
        `http://localhost:8080/marketplace/${item.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create item.");
      }

      fetchItems();
      setShowDeleteItemModal(true);
    } catch (error) {
      console.error("Error creating item:", error);
      setCreateItemError(error.message);
    }
  };

  const handleCreateItem = async () => {
    setCreateItemError(null); // Clear any previous errors

    if (!newItemName || !newItemPrice) {
      setCreateItemError("Please enter both name and price.");
      return;
    }

    try {
      const newItem = { name: newItemName, price: parseInt(newItemPrice) };
      const response = await fetch(`http://localhost:8080/marketplace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create item.");
      }

      const createdItem = await response.json();
      setItems([...items, createdItem]);
      setNewItemName("");
      setNewItemPrice("");
      setShowCreateItemModal(true);
    } catch (error) {
      console.error("Error creating item:", error);
      setCreateItemError(error.message);
    }
  };

  return (
    <div className="marketplace">
      {" "}
      {/* Add a className to the container */}
      <h2>Marketplace</h2>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Style error messages */}
      <h3>Create New Item</h3>
      <div className="input-group">
        {" "}
        {/* Wrap inputs in a div for styling */}
        <input
          type="text"
          placeholder="Item Name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Price"
          value={newItemPrice}
          onChange={(e) => setNewItemPrice(e.target.value)}
          className="input-field"
        />
      </div>
      <button onClick={handleCreateItem} className="create-button">
        Create
      </button>
      {createItemError && <p className="error-message">{createItemError}</p>}
      <h3>Available Items</h3>
      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id} className="item-list-item">
            {item.name} - Price: {item.price} gold
            <button
              onClick={() => handleBuy(item)}
              disabled={playerGold < item.price}
              className="buy-button"
            >
              Buy
            </button>
            <button
              onClick={() => handleDeleteItem(item)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {showBuyModal && (
        <Modal onClose={() => setShowBuyModal(false)}>
          - {modalGoldAmount} gold
        </Modal>
      )}
      {showCreateItemModal && (
        <Modal onClose={() => setShowCreateItemModal(false)}>
          Item created!
        </Modal>
      )}
      {showDeleteItemModal && (
        <Modal onClose={() => setShowDeleteItemModal(false)}>
          Item deleted!
        </Modal>
      )}
    </div>
  );
}

export default Marketplace;
