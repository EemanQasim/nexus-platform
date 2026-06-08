import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  startAdornment,
  endAdornment,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-semibold text-dark-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {startAdornment && (
          <div className="absolute left-3 text-dark-400 pointer-events-none">{startAdornment}</div>
        )}
        <input
          className={`
            block rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm text-dark-900
            placeholder-dark-300 shadow-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-dark-50 disabled:text-dark-400 disabled:cursor-not-allowed
            ${error ? 'border-error-400 focus:ring-error-400' : ''}
            ${startAdornment ? 'pl-10' : ''}
            ${endAdornment ? 'pr-10' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-3 text-dark-400">{endAdornment}</div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-error-500 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-dark-400">{helperText}</p>}
    </div>
  );
};
