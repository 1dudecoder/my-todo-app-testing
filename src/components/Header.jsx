import React from 'react';
import { CheckSquare, Moon, Sun, Sparkles } from 'lucide-react';

export default function Header({ theme, toggleTheme, stats }) {
  const { total, completed, percent } = stats;

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="logo-group">
          <div className="logo-icon">
            <CheckSquare size={28} />
          </div>
          <div>
            <h1 className="logo-title">TaskFlow</h1>
            <p className="logo-subtitle">Organize your day, accomplish your goals</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {total > 0 && (
        <div className="progress-card">
          <div className="progress-info">
            <span className="progress-title">
              <Sparkles size={16} className="sparkle-icon" />
              {percent === 100
                ? "All tasks done! Outstanding work! 🎉"
                : `${completed} of ${total} tasks completed (${percent}%)`}
            </span>
            <span className="progress-fraction">{percent}%</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      )}
    </header>
  );
}
