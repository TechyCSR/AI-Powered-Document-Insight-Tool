import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import type { Theme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ];

  const currentTheme = themes.find(t => t.value === theme);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300 shadow-sm"
        aria-label="Toggle theme"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          {currentTheme?.icon}
          <span className="text-sm font-medium hidden sm:inline">{currentTheme?.label}</span>
        </div>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-44 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl py-2 z-[9999] animate-fade-in">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={(e) => {
                e.stopPropagation();
                handleThemeChange(themeOption.value);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                theme === themeOption.value 
                  ? 'bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className={`${theme === themeOption.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'} transition-colors`}>
                {themeOption.icon}
              </span>
              <span className="flex-1 text-left font-medium">{themeOption.label}</span>
              {theme === themeOption.value && (
                <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
