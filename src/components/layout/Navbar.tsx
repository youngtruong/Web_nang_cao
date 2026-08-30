import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '@/store/useThemeStore';
import { Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-primary-600 dark:text-primary-400">
          Web Nâng Cao
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Chuyển Dark/Light mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
