import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-emerald-600 hover:shadow-md active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    secondary: 'border border-border/50 text-text bg-surface hover:bg-slate-100 hover:border-border active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary',
    ghost: 'text-text hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary',
  };

  const sizes = {
    sm: 'h-8 rounded-lg px-3 text-xs font-medium',
    md: 'h-11 rounded-xl px-6 text-sm font-semibold',
    lg: 'h-13 rounded-2xl px-8 text-base font-bold',
  };

  return (
    <button
      className={`inline-flex items-center justify-center cursor-pointer select-none transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className || ''} disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;