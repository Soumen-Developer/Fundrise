import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: any) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  disabled,
  error,
  className = '',
  textarea = false,
  rows = 4,
  required = false,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text mb-1">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      {textarea ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          required={required}
          className="w-full rounded-lg border border-border/50 px-4 py-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder:text-text/50 disabled:opacity-50 resize-y"
          style={{ background: 'var(--surface)' }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="w-full rounded-lg border border-border/50 px-4 py-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder:text-text/50 disabled:opacity-50"
          style={{ background: 'var(--surface)' }}
        />
      )}
      {error && (
        <p className="mt-2 text-error text-sm">{error}</p>
      )}
    </div>
  );
};

export default Input;