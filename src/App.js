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
import Marketplace from "./Marketplace";
import CharacterView from "./CharacterView";
import createApi from "./RequestInterceptor";

import { initializeApp } from "firebase/app";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from "firebase/auth";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [playerGold, setPlayerGold] = useState(0);
  const [playerExp, setPlayerExp] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalGoldAmount, setModalGoldAmount] = useState(0);
  const [modalExpAmount, setModalExpAmount] = useState(0);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todos, setTodos] = useState([]);

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  let api = createApi(auth);

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      window.alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      window.alert("Error signing out:", error);
    }
  };

  const fetchRewards = async () => {
    api
      .get("/rewards")
      .then((response) => {
        setPlayerGold(response.data.amount);
      })
      .catch((error) => {
        console.error("Error fetching rewards:", error);
      });
  };

  const fetchTodos = async () => {
    api
      .get("/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  };

  const fetchPlayerLevel = async () => {
    api
      .get("/player")
      .then((response) => {
        setPlayerLevel(response.data.playerLevel);
        setPlayerExp(response.data.exp);
      })
      .catch((error) => {
        console.error("Error fetching player level: ", error);
      });
  };

  useEffect(() => {
    fetchTodos();
    fetchRewards();
    fetchPlayerLevel();

    const handleAdventureComplete = async (event) => {
      const gainedExp = event.detail.exp;
      await api
        .put("/player", gainedExp)
        .then((response) => {
          setPlayerLevel(response.data.playerLevel);
          setPlayerExp(response.data.exp);
        })
        .catch((error) => {
          console.error("Error updating player: ", error);
        });

      setPlayerGold((prevGold) => {
        const newGold = prevGold + event.detail.amount;

        (async () => {
          api.put("/rewards", { amount: newGold }).catch((error) => {
            console.error("Error updating rewards:", error);
          });
        })();

        return newGold;
      });
      setModalGoldAmount(event.detail.amount);
      setModalExpAmount(event.detail.exp);
      setShowModal(true);
    };

    window.addEventListener("adventureCompleted", handleAdventureComplete);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
        api = createApi(auth);
        fetchRewards();
        fetchTodos();
        fetchPlayerLevel();
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener("adventureCompleted", handleAdventureComplete);
    };
  }, []);

  return user ? (
    <BrowserRouter>
      <main>
        <div style={{ position: "fixed", top: 25, right: 10, zIndex: 100 }}>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div style={{ position: "fixed", zIndex: 100 }}>
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
            <Link to="/tasks">
              <button>Todo List</button>
            </Link>
            <Link to="/notes">
              <button>Notes</button>
            </Link>
            <Link to="/market">
              <button>Marketplace</button>
            </Link>
            <Link to="/character">
              <button>Character</button>
            </Link>
          </div>
        </div>

        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            + {modalGoldAmount} coins, + {modalExpAmount} exp
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
                        const selectedId = e.target.value;
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
                      {Array.isArray(todos) &&
                        todos
                          .filter((todo) => !todo.completed)
                          .map((todo) => (
                            <option key={todo.id} value={todo.id}>
                              {todo.title}
                            </option>
                          ))}
                    </select>
                  </div>
                  <AdventureMap api={api} />
                  {showSettings ? <Settings /> : <Timer />}
                </SettingsContext.Provider>
              </div>
            }
          />
          <Route path="/tasks" element={<TodoList api={api} />} />

          <Route path="/notes" element={<TodoNotes api={api} />} />
          <Route
            path="/market"
            element={
              <Marketplace
                playerGold={playerGold}
                updatePlayerGold={fetchRewards}
                api={api}
              />
            }
          />
          <Route path="/character" element={<CharacterView api={api} />} />
        </Routes>
        <div
          style={{
            position: "absolute",
            alignItems: "center",
            display: "flex",
            left: "20px",
            bottom: "10px",
            fontSize: "15px",
            zIndex: 100,
          }}
        >
          Level: {playerLevel}
          <progress
            value={playerExp}
            max={100}
            style={{ width: "80px", height: "20px", margin: "0 20px" }}
          />
          <img
            style={{ width: "60px", height: "60px" }}
            src={coinsImage}
            alt="Coins"
          />
          {playerGold}
        </div>
      </main>
    </BrowserRouter>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => signIn(email, password)}>Login</button>
    </div>
  );
}

export default App;
