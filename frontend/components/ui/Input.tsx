'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, hint, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-[var(--text-secondary)]"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-3
            bg-[var(--surface)] text-[var(--text-primary)]
            border border-[var(--border)]
            rounded-[var(--radius-md)]
            placeholder:text-[var(--text-muted)]
            transition-all duration-[var(--transition-base)]
            focus:outline-none focus:border-[var(--accent)]
            focus:ring-2 focus:ring-[var(--accent-muted)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-red-500/20' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <span className="text-sm text-[var(--error)]">{error}</span>
                )}
                {hint && !error && (
                    <span className="text-sm text-[var(--text-tertiary)]">{hint}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
