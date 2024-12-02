import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import "./Marketplace.css";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

function Marketplace({ playerGold, updatePlayerGold, api }) {
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
    api.get("/marketplace").then((response) => {
      setItems(response.data);
    });
  };

  const handleBuy = async (item) => {
    api
      .post(`/marketplace/${item.id}/buy`)
      .then((response) => {
        updatePlayerGold();
        setModalGoldAmount(item.price);
        setShowBuyModal(true);
        fetchItems();
      })
      .catch((error) => {
        console.error("Error buying item:", error);
        setError("Error purchasing item. Please try again later.");
      });
  };

  const handleDeleteItem = async (item) => {
    api
      .delete(`/marketplace/${item.id}`)
      .then((response) => {
        fetchItems();
        setShowDeleteItemModal(true);
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setError("Error deleting item. Please try again later.");
      });
  };

  const handleCreateItem = async () => {
    setCreateItemError(null); // Clear any previous errors

    if (!newItemName || !newItemPrice) {
      setCreateItemError("Please enter both name and price.");
      return;
    }

    api
      .post("/marketplace", {
        name: newItemName,
        price: parseInt(newItemPrice),
      })
      .then((response) => {
        setItems([...items, response.data]);
        setNewItemName("");
        setNewItemPrice("");
        setShowCreateItemModal(true);
      })
      .catch((error) => {
        console.error("Error creating item:", error);
        setCreateItemError(error.message);
      });
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
