'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

const variantStyles = {
    primary: `
    bg-[var(--accent)] text-white
    hover:bg-[var(--accent-hover)]
    shadow-[0_0_20px_rgba(139,92,246,0.3)]
    hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]
  `,
    secondary: `
    bg-[var(--surface)] text-[var(--text-primary)]
    border border-[var(--border)]
    hover:bg-[var(--surface-hover)] hover:border-[var(--text-tertiary)]
  `,
    ghost: `
    bg-transparent text-[var(--text-secondary)]
    hover:bg-[var(--surface)] hover:text-[var(--text-primary)]
  `,
    danger: `
    bg-[var(--error)] text-white
    hover:bg-red-600
  `,
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={`
          inline-flex items-center justify-center
          font-medium rounded-[var(--radius-md)]
          transition-all duration-200
          hover:scale-[1.02] active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${variantStyles[variant]}
          ${sizes[size]}
          ${className}
        `}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : icon ? (
                    <span className="flex-shrink-0">{icon}</span>
                ) : null}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
