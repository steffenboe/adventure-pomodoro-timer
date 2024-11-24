import AdventureMap from "./AdventureMap";
import "./App.css";
import Settings from "./Settings";
import SettingsContext from "./SettingsContext";
import Timer from "./Timer";
import { useState, useEffect } from "react";
import backgroundImage from "./assets/images/forestmountains.jpg";
import coinsImage from "./assets/images/coins.png";
import Modal from "./Modal";
import TodoList from "./TodoList";
import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoNotes from "./TodoNotes";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [playerGold, setPlayerGold] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalGoldAmount, setModalGoldAmount] = useState(0);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      const newTodoItem = {
        id: '',
        title: newTodo,
        completed: false,
        notes: "",
      };

      try {
        const response = await fetch("http://localhost:8080/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodoItem),
        });

        if (!response.ok) {
          // Handle errors, e.g., display an error message to the user
          const errorData = await response.json(); // Get error details from the response
          console.error("Failed to add todo:", errorData); // Log the error
          alert("Failed to add todo. Please try again."); // Or show a more sophisticated error message
        } else {
          const data = await response.json(); // If successful, parse and use server's response (e.g., the added todo)
          setTodos([...todos, data]); // Assumes server returns new todo. Otherwise still use client-side object: newTodoItem

          setNewTodo("");
        }
      } catch (error) {
        console.error("Error adding todo:", error); // Catch network errors
        // ... other error handling as needed
      }
    }
  };

  const toggleComplete = async (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
    const adventureCompletedEvent = new CustomEvent("adventureCompleted", {
      detail: { amount: 5 },
    });
    window.dispatchEvent(adventureCompletedEvent);
    try {
      const response = await fetch(
        `http://localhost:8080/todos/${updatedTodos[index].id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodos[index]),
        }
      );

      if (!response.ok) {
        console.error("Failed to update todo:", response);
        alert("Failed to update todo. Please try again.");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const removeTodo = async (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    try {
      const response = await fetch(
        `http://localhost:8080/todos/${updatedTodos[index].id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        console.error("Failed to delete todo:", response);
        alert("Failed to delete todo. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:8080/todos");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
        // Handle error appropriately (e.g., display an error message)
      }
    };

    fetchTodos();

    const handleAdventureComplete = (event) => {
      setPlayerGold((prevGold) => prevGold + event.detail.amount);
      setModalGoldAmount(event.detail.amount);
      setShowModal(true);
    };

    window.addEventListener("adventureCompleted", handleAdventureComplete);

    return () => {
      window.removeEventListener("adventureCompleted", handleAdventureComplete);
    };
  }, []);

  return (
    <BrowserRouter>
      <main>
        <div style={{ position: "fixed", zIndex: 100 }}>
          <div
            style={{
              position: "fixed",
              alignItems: "center",
              display: "flex",
              right: "20px",
              top: "10px",
              fontSize: "30px",
            }}
          >
            <img
              style={{ width: "60px", height: "60px" }}
              src={coinsImage}
              alt="Coins"
            />
            {playerGold}
          </div>

          <div
            style={{
              position: "fixed",
              display: "flex",
              flexDirection: "row",
              top: 25,
              left: 10,
            }}
          >
            <Link to="/">
              <button>Timer</button>
            </Link>
            <Link to="/todo">
              <button>Todo List</button>
            </Link>
            <Link to="/notes">
              <button>Notes</button>
            </Link>
          </div>
        </div>

        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            Congratulations! You earned {modalGoldAmount} gold!
          </Modal>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <div
                style={{
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
                    setWorkMinutes,
                    breakMinutes,
                    setBreakMinutes,
                    longBreakMinutes,
                    setLongBreakMinutes,
                  }}
                >
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <select
                      value={selectedTodo ? selectedTodo.id : ""}
                      onChange={(e) => {
                        const selectedId = parseInt(e.target.value, 10);
                        const selected = todos.find(
                          (todo) => todo.id === selectedId
                        );
                        setSelectedTodo(selected);
                      }}
                      style={{
                        position: "fixed",
                        top: "70px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "240px",
                        background: "#9E8C98",
                        height: "40px",
                        border: "none",
                        color: "white",
                        fontSize: "16px",
                        borderRadius: "5px",
                        padding: "0 10px",
                        zIndex: 100,
                      }}
                    >
                      <option value="">What are you working on?</option>
                      {todos
                        .filter((todo) => !todo.completed)
                        .map((todo) => (
                          <option key={todo.id} value={todo.id}>
                            {todo.text}
                          </option>
                        ))}
                    </select>
                  </div>
                  <AdventureMap />
                  {showSettings ? <Settings /> : <Timer />}
                </SettingsContext.Provider>
              </div>
            }
          />
          <Route
            path="/todo"
            element={
              <TodoList
                todos={todos}
                setTodos={setTodos}
                addTodo={addTodo}
                toggleComplete={toggleComplete}
                removeTodo={removeTodo}
                newTodo={newTodo}
                setNewTodo={setNewTodo}
              />
            }
          />

          <Route
            path="/notes"
            element={
              <TodoNotes
                todos={todos} // Pass the todos array
                updateTodo={(updatedTodo) => {
                  // This part is crucial: find and update the todo within your state
                  setTodos(
                    todos.map((t) =>
                      t.id === updatedTodo.id ? updatedTodo : t
                    )
                  );
                }}
              />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
