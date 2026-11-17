import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  Trash2,
  Edit3,
  X,
  Calendar,
  Tag,
  AlertCircle,
} from 'lucide-react';

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-item-left">
        <button
          type="button"
          className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        >
          {todo.completed && <Check size={14} strokeWidth={3} />}
        </button>

        {isEditing ? (
          <div className="inline-edit-wrapper">
            <input
              ref={editInputRef}
              type="text"
              className="inline-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="edit-actions">
              <button
                type="button"
                className="edit-action-btn save"
                onClick={handleSave}
                title="Save (Enter)"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                className="edit-action-btn cancel"
                onClick={() => {
                  setEditText(todo.text);
                  setIsEditing(false);
                }}
                title="Cancel (Esc)"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="todo-content" onDoubleClick={() => setIsEditing(true)}>
            <p className="todo-text">{todo.text}</p>
            <div className="todo-meta">
              <span className={`priority-badge ${todo.priority}`}>
                {todo.priority}
              </span>
              {todo.category && (
                <span className="category-badge">
                  <Tag size={11} />
                  {todo.category}
                </span>
              )}
              {todo.createdAt && (
                <span className="date-badge">
                  <Calendar size={11} />
                  {formatDate(todo.createdAt)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="todo-item-actions">
          <button
            type="button"
            className="action-icon-btn edit-btn"
            onClick={() => setIsEditing(true)}
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit3 size={16} />
          </button>
          <button
            type="button"
            className="action-icon-btn delete-btn"
            onClick={() => onDelete(todo.id)}
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </li>
  );
}
