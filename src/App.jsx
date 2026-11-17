import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoFilters from './components/TodoFilters';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import './App.css';

const LOCAL_STORAGE_KEY = 'taskflow_todos_v1';
const THEME_KEY = 'taskflow_theme';

const DEFAULT_TODOS = [
  {
    id: 'task-1',
    text: 'Welcome to TaskFlow! 👋',
    completed: false,
    priority: 'high',
    category: 'General',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    text: 'Click the checkbox on the left to complete a task',
    completed: true,
    priority: 'medium',
    category: 'General',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'task-3',
    text: 'Double click or tap the edit icon to change any task',
    completed: false,
    priority: 'low',
    category: 'Work',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'task-4',
    text: 'Filter by Active or Completed and search your tasks above',
    completed: false,
    priority: 'medium',
    category: 'Study',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme;
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Todos state
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved todos', e);
    }
    return DEFAULT_TODOS;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save todos', e);
    }
  }, [todos]);

  // Filtering & Sorting State
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'priority' | 'alphabetical'

  // Add Task
  const handleAddTask = ({ text, priority, category }) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text,
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTask, ...prev]);
  };

  // Toggle Complete
  const handleToggleTask = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete Task
  const handleDeleteTask = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Edit Task
  const handleEditTask = (id, newText) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  // Clear Completed
  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  // Toggle All (all done or all undone)
  const allCompleted = todos.length > 0 && todos.every((t) => t.completed);
  const handleToggleAll = () => {
    const nextState = !allCompleted;
    setTodos((prev) => prev.map((t) => ({ ...t, completed: nextState })));
  };

  // Stats
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, active, percent };
  }, [todos]);

  // Filtered and sorted tasks
  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        // Status filter
        if (filter === 'active' && todo.completed) return false;
        if (filter === 'completed' && !todo.completed) return false;

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesText = todo.text.toLowerCase().includes(query);
          const matchesCategory =
            todo.category && todo.category.toLowerCase().includes(query);
          return matchesText || matchesCategory;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'priority') {
          const weight = { high: 3, medium: 2, low: 1 };
          return (weight[b.priority] || 0) - (weight[a.priority] || 0);
        }
        if (sortBy === 'alphabetical') {
          return a.text.localeCompare(b.text);
        }
        return 0;
      });
  }, [todos, filter, searchQuery, sortBy]);

  return (
    <div className="app-container">
      <main className="todo-card">
        <Header theme={theme} toggleTheme={toggleTheme} stats={stats} />

        <TodoForm onAddTask={handleAddTask} />

        <TodoFilters
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          stats={stats}
        />

        <TodoList
          todos={filteredTodos}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
          filter={filter}
          searchQuery={searchQuery}
        />

        <TodoFooter
          stats={stats}
          onClearCompleted={handleClearCompleted}
          onToggleAll={handleToggleAll}
          allCompleted={allCompleted}
        />
      </main>

      <footer className="author-credits">
        <p>Built with React & Vite • LocalStorage Synced</p>
      </footer>
    </div>
  );
}
