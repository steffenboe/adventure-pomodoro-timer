import { useState } from "react";
import "./TodoList.css";

function TodoList({ todos, setTodos, addTodo, newTodo, setNewTodo, toggleComplete, removeTodo }) {
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

