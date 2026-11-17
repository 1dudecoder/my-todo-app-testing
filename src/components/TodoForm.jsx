import React, { useState } from 'react';
import { PlusCircle, Tag, Flag } from 'lucide-react';

const CATEGORIES = ['General', 'Work', 'Personal', 'Shopping', 'Study'];

export default function TodoForm({ onAddTask }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onAddTask({
      text: trimmed,
      priority,
      category,
    });

    setText('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="input-row">
        <input
          type="text"
          className="todo-input"
          placeholder="What do you need to get done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          className="add-btn"
          disabled={!text.trim()}
          title="Add task"
        >
          <PlusCircle size={20} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="form-options">
        <div className="option-group">
          <Flag size={15} className="option-icon" />
          <span className="option-label">Priority:</span>
          <div className="priority-pills">
            {['low', 'medium', 'high'].map((p) => (
              <button
                key={p}
                type="button"
                className={`priority-pill ${priority === p ? `active ${p}` : ''}`}
                onClick={() => setPriority(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="option-group">
          <Tag size={15} className="option-icon" />
          <span className="option-label">Category:</span>
          <select
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}
