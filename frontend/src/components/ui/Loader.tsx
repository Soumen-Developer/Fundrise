import React from 'react';
import { Sparkles } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'text-primary',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <svg
      className={`animate-spin ${sizeMap[size]} ${color} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading platform experience...',
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring */}
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 animate-ping absolute" />
        {/* Middle rotating spinner */}
        <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin" />
        {/* Center glowing icon */}
        <div className="absolute w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
      </div>
      <p className="mt-6 text-sm font-medium text-text-secondary animate-pulse tracking-wide">
        {message}
      </p>
    </div>
  );
};

export default Spinner;
