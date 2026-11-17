import React from 'react';
import TodoItem from './TodoItem';
import { ClipboardList, SearchX, CheckCircle2 } from 'lucide-react';

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  filter,
  searchQuery,
}) {
  if (todos.length === 0) {
    let icon = <ClipboardList size={48} className="empty-icon" />;
    let title = "No tasks yet";
    let subtitle = "Add your first task above to get your day moving!";

    if (searchQuery) {
      icon = <SearchX size={48} className="empty-icon" />;
      title = "No tasks found";
      subtitle = `No tasks matched your search for "${searchQuery}".`;
    } else if (filter === 'completed') {
      icon = <CheckCircle2 size={48} className="empty-icon" />;
      title = "No completed tasks yet";
      subtitle = "Check off completed items to see them here.";
    } else if (filter === 'active') {
      icon = <CheckCircle2 size={48} className="empty-icon" />;
      title = "No active tasks";
      subtitle = "You are all caught up! Take a break or add a new task.";
    }

    return (
      <div className="empty-state">
        {icon}
        <h3 className="empty-title">{title}</h3>
        <p className="empty-desc">{subtitle}</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
