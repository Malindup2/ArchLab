'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    onClick?: () => void;
}

export function Card({ children, className = '', hover = false, glow = false, onClick }: CardProps) {
    return (
        <motion.div
            whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={`
        bg-[var(--surface)] 
        border border-[var(--border)]
        rounded-[var(--radius-lg)]
        transition-all duration-[var(--transition-base)]
        ${hover ? 'cursor-pointer hover:border-[var(--text-tertiary)] hover:shadow-lg' : ''}
        ${glow ? 'shadow-[var(--shadow-glow)]' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`px-6 py-4 border-b border-[var(--border-subtle)] ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`px-6 py-4 border-t border-[var(--border-subtle)] ${className}`}>
            {children}
        </div>
    );
}
