import React from 'react';

interface LogoAdipronProps {
  className?: string;
  size?: number; // size in px for the emblem, defaults to 40
  showText?: boolean;
  lightText?: boolean; // for dark backgrounds like footer
}

export const LogoAdipron: React.FC<LogoAdipronProps> = ({
  className = '',
  size = 40,
  showText = true,
  lightText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Brand Icon SVG: Concentric Whirlpool Spiral matching official brand */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
        aria-hidden="true"
      >
        {/* Outer subtle guideline */}
        <circle cx="50" cy="50" r="45" stroke="#00833e" strokeWidth="1.5" opacity="0.3" strokeDasharray="3 3" />
        
        {/* Layer 1 - Outer emerald crescent vortex */}
        <path
          d="M 50 7 C 73.7 7 93 26.3 93 50 C 93 73.7 73.7 93 50 93 C 33.5 93 19.3 83.7 12 70 C 21.2 80.5 34.8 87 50 87 C 70.4 87 87 70.4 87 50 C 87 29.6 70.4 13 50 13 C 36.8 13 25.3 20 19 30.5 C 25 16.5 36.5 7 50 7 Z"
          fill="#007e3a"
        />

        {/* Layer 2 - Intermediate fluid vortex */}
        <path
          d="M 50 17 C 68.2 17 83 31.8 83 50 C 83 68.2 68.2 83 50 83 C 36 83 23.8 74.3 18.5 62 C 25 70.5 36.5 76.5 50 76.5 C 64.6 76.5 76.5 64.6 76.5 50 C 76.5 35.4 64.6 23.5 50 23.5 C 39.5 23.5 30.5 29.5 26 38.5 C 31 25.5 39.8 17 50 17 Z"
          fill="#009345"
        />

        {/* Layer 3 - Core dynamic vortex arc */}
        <path
          d="M 50 27 C 62.7 27 73 37.3 73 50 C 73 62.7 62.7 73 50 73 C 39.5 73 30.7 66 27.5 56 C 31.8 63 40.2 67.5 50 67.5 C 59.7 67.5 67.5 59.7 67.5 50 C 67.5 40.3 59.7 32.5 50 32.5 C 42.5 32.5 36.2 37 33.2 43.5 C 36.5 33.5 42.5 27 50 27 Z"
          fill="#15a956"
        />

        {/* Layer 4 - Inner focal curl */}
        <path
          d="M 50 37 C 57.2 37 63 42.8 63 50 C 63 57.2 57.2 63 50 63 C 43.5 63 38 58.2 36.5 52 C 39 56 44 58.5 50 58.5 C 54.7 58.5 58.5 54.7 58.5 50 C 58.5 45.3 54.7 41.5 50 41.5 C 46 41.5 42.5 43.8 41 47 C 42.8 41 46 37 50 37 Z"
          fill="#20bc62"
        />
      </svg>

      {/* Typography with clean proportions */}
      {showText && (
        <div className="flex flex-col leading-none select-none">
          <span
            className={`font-mono text-xl sm:text-2xl font-bold tracking-wider ${
              lightText ? 'text-white' : 'text-[#00833e]'
            }`}
          >
            Adipron
          </span>
          <span
            className={`text-[11px] sm:text-xs font-medium tracking-[0.22em] lowercase mt-0.5 ${
              lightText ? 'text-slate-300' : 'text-slate-800'
            }`}
          >
            informática
          </span>
        </div>
      )}
    </div>
  );
};
