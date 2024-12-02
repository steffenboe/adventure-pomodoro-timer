import { useEffect, useState } from "react";
import "./TodoList.css";

function TodoList({ api }) {
  
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

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

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      const newTodoItem = {
        id: "",
        title: newTodo,
        completed: false,
        notes: "",
      };

      api
        .post("/todos", newTodoItem)
        .then((response) => {
          setTodos([...todos, response.data]);
          setNewTodo("");
        })
        .catch((error) => {
          console.error("Failed to add todo:", error.data);
          alert("Failed to add todo. Please try again.");
        });
    }
  };

  const toggleComplete = async (index) => {
    try {
      const updatedTodo = {
        ...todos[index],
        completed: !todos[index].completed,
      };

      api
        .put(`/todos/${updatedTodo.id}`, updatedTodo)
        .then((response) => {
          setTodos(todos.map((todo, i) => (i === index ? updatedTodo : todo)));

          if (updatedTodo.completed) {
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
        })
        .catch((error) => {
          console.error("Error updating todo:", error);
        });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const removeTodo = async (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);

    api
      .delete(`/todos/${todos[index].id}`)
      .then((response) => {
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("Failed to delete todo:", error.data);
        alert("Failed to delete todo. Please try again.");
      });
  };
  
  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="input-area">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {Array.isArray(todos) && todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todos.findIndex(t => t.id === todo.id))} 
            />
            <span>{todo.title}</span>
            <button className="remove-button" onClick={() => removeTodo(todos.findIndex(t => t.id === todo.id))}>
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;

