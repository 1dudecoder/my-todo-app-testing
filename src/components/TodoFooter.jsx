import React from 'react';
import { CheckCheck, Trash2 } from 'lucide-react';

export default function TodoFooter({
  stats,
  onClearCompleted,
  onToggleAll,
  allCompleted,
}) {
  if (stats.total === 0) return null;

  return (
    <footer className="todo-footer">
      <div className="footer-left">
        <span className="items-left">
          <strong>{stats.active}</strong> {stats.active === 1 ? 'task' : 'tasks'} remaining
        </span>
      </div>

      <div className="footer-actions">
        <button
          type="button"
          className="footer-btn secondary"
          onClick={onToggleAll}
          title={allCompleted ? 'Mark all as incomplete' : 'Mark all as complete'}
        >
          <CheckCheck size={16} />
          <span>{allCompleted ? 'Uncheck All' : 'Mark All Done'}</span>
        </button>

        {stats.completed > 0 && (
          <button
            type="button"
            className="footer-btn danger"
            onClick={onClearCompleted}
            title="Remove all completed tasks"
          >
            <Trash2 size={16} />
            <span>Clear Completed ({stats.completed})</span>
          </button>
        )}
      </div>
    </footer>
  );
}
