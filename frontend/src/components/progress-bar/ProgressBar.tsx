import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  className = '',
}) => {
  const safePercentage = Math.min(Math.max(Math.round(percentage), 0), 100);

  const getBarColor = () => {
    if (safePercentage >= 80) return 'bg-success';
    if (safePercentage >= 40) return 'bg-primary';
    return 'bg-secondary';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor()}`}
          style={{ width: `${safePercentage}%` }}
          role="progressbar"
          aria-valuenow={safePercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {label && (
        <div className="flex justify-between items-center text-xs text-text-secondary mt-1">
          <span>{label}</span>
          <span className="font-semibold">{safePercentage}%</span>
        </div>
      )}
    </div>
  );
};

export { ProgressBar };
export default ProgressBar;