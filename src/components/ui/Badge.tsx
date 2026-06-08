import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'gray' | 'error' | 'success' | 'warning';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-700 border border-primary-200',
  secondary: 'bg-secondary-100 text-secondary-700 border border-secondary-200',
  accent: 'bg-accent-100 text-accent-700 border border-accent-200',
  gray: 'bg-dark-100 text-dark-600 border border-dark-200',
  error: 'bg-error-50 text-error-700 border border-error-200',
  success: 'bg-accent-50 text-accent-700 border border-accent-200',
  warning: 'bg-warning-50 text-warning-700 border border-warning-200',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-1.5 py-0.5 rounded-md',
  md: 'text-xs px-2.5 py-1 rounded-lg',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  onClick,
}) => {
  return (
    <span
      className={`inline-flex items-center font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
