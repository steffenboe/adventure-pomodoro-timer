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

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo, completed: false, notes: "" },
      ]);
      setNewTodo("");
    }
  };

  const toggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
    console.log(todos);
  };

  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  useEffect(() => {
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
