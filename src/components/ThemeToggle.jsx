import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative group w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden"
      aria-label="Toggle Theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Dynamic Background */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'bg-emerald-900/40 backdrop-blur-md' : 'bg-orange-50/50'}`}></div>

      <div className="relative z-10 w-8 h-8 flex items-center justify-center transform transition-transform duration-700">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Owl Body */}
          <path
            d="M12 2C8 2 5 5 5 9C5 12 7 14 7 17C7 19 8.5 21 10 21C11 21 11.5 20.5 12 20.5C12.5 20.5 13 21 14 21C15.5 21 17 19 17 17C17 14 19 12 19 9C19 5 16 2 12 2Z"
            fill={isDark ? "#12261a" : "#fef3c7"}
            stroke={isDark ? "#8cc63f" : "#d97706"}
            strokeWidth="1.5"
            className="transition-all duration-700"
          />

          {/* Inner Wings / Pattern */}
          <path
            d="M8 12C8 12 9 10 12 10C15 10 16 12 16 12"
            stroke={isDark ? "#8cc63f50" : "#d9770630"}
            strokeWidth="1"
            className="transition-all duration-700"
          />

          {/* Small Ears/Horns */}
          <path
            d="M8.5 3.5L7 2"
            stroke={isDark ? "#8cc63f" : "#d97706"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M15.5 3.5L17 2"
            stroke={isDark ? "#8cc63f" : "#d97706"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Eyes (The perfection part) */}
          <g className="transition-all duration-700">
            {/* Left Eye */}
            <circle
              cx="9"
              cy="9"
              r="2.5"
              fill={isDark ? "#064e3b" : "white"}
              className="transition-all duration-700"
            />
            <circle
              cx="9"
              cy="9"
              r={isDark ? "1.2" : "1.8"}
              fill={isDark ? "#10b981" : "#1f2937"}
              className={`transition-all duration-700 ${isDark ? 'animate-pulse' : ''}`}
            />
            {isDark && (
              <circle
                cx="9"
                cy="9"
                r="3.5"
                fill="#10b981"
                fillOpacity="0.1"
                className="animate-pulse"
              />
            )}

            {/* Right Eye */}
            <circle
              cx="15"
              cy="9"
              r="2.5"
              fill={isDark ? "#064e3b" : "white"}
              className="transition-all duration-700"
            />
            <circle
              cx="15"
              cy="9"
              r={isDark ? "1.2" : "1.8"}
              fill={isDark ? "#10b981" : "#1f2937"}
              className={`transition-all duration-700 ${isDark ? 'animate-pulse' : ''}`}
            />
            {isDark && (
              <circle
                cx="15"
                cy="9"
                r="3.5"
                fill="#10b981"
                fillOpacity="0.1"
                className="animate-pulse"
              />
            )}
          </g>

          {/* Beak */}
          <path
            d="M11 11L12 13L13 11"
            fill={isDark ? "#8cc63f" : "#f59e0b"}
            stroke={isDark ? "#8cc63f" : "#f59e0b"}
            strokeWidth="1"
            className="transition-all duration-700"
          />
        </svg>

        {/* Shine/Reflection (Light mode only) */}
        {!isDark && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-white/60 rounded-full blur-[1px]"></div>
        )}
      </div>

      {/* Halo Effect in Dark Mode */}
      {isDark && (
        <div className="absolute inset-0 bg-[#8cc63f]/5 rounded-2xl animate-pulse -z-10"></div>
      )}
    </button>
  );
};

export default ThemeToggle;
