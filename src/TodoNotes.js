import { useState, useEffect } from "react";

function TodoNotes({ todos, updateTodo }) {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (selectedTodo) {
      setNotes(selectedTodo.notes || "");
    } else {
      setNotes("");
    }
  }, [selectedTodo]);

  const handleTodoChange = (event) => {
    const selectedId = event.target.value;
    const selected = todos.find((todo) => todo.id === selectedId);
    setSelectedTodo(selected);
  };

  const handleNoteChange = (event) => {
    setNotes(event.target.value); // Update local state only
  };

  const handleNoteSave = async () => {
    updateTodo({ ...selectedTodo, notes }); // Now this only runs on save
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <select
        value={selectedTodo ? selectedTodo.id : ""}
        onChange={handleTodoChange}
      >
        <option value="">Select a Todo</option>
        {todos.map((todo) => (
          <option key={todo.id} value={todo.id}>
            {todo.title}
          </option>
        ))}
      </select>

      {selectedTodo && (
        <div>
          <textarea
            value={notes}
            onChange={handleNoteChange}
            placeholder="Add your notes here..."
            style={{ width: "100%", height: "150px", marginTop: "10px" }}
          />
          <button onClick={handleNoteSave}>Save Notes</button>
        </div>
      )}
    </div>
  );
}

export default TodoNotes;
