import { useState, useEffect } from 'react';

function TodoNotes({ todos, updateTodo }) { 
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedTodo) {
      setNotes(selectedTodo.notes || '');
    } else {
      setNotes('')
    }
  }, [selectedTodo]);

  useEffect(() => {
    if (selectedTodo) {
      updateTodo({ ...selectedTodo, notes });
    }
  }, [notes, selectedTodo, updateTodo]);


  const handleTodoChange = (event) => {
    const selectedId = parseInt(event.target.value, 10);
    const selected = todos.find(todo => todo.id === selectedId);
    setSelectedTodo(selected);
  };

  const handleNoteChange = (event) => {
    setNotes(event.target.value);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <select value={selectedTodo ? selectedTodo.id : ''} onChange={handleTodoChange}>
        <option value="">Select a Todo</option>
        {todos.map(todo => (
          <option key={todo.id} value={todo.id}>
            {todo.text}
          </option>
        ))}
      </select>

      {selectedTodo && (
        <textarea
          value={notes}
          onChange={handleNoteChange}
          placeholder="Add your notes here..."
          style={{ width: '100%', height: '150px', marginTop: '10px' }}
        />
      )}
    </div>
  );
}

export default TodoNotes;

