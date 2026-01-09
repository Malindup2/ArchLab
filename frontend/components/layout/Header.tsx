'use client';

import { Download, Share2, ChevronDown, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
    projectName?: string;
    versionNumber?: number;
    onExport?: () => void;
    onShare?: () => void;
    onVersionChange?: () => void;
}

export function Header({
    projectName = 'Untitled Project',
    versionNumber = 1,
    onExport,
    onShare,
    onVersionChange,
}: HeaderProps) {
    return (
        <header className="workspace-header bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4">
            {/* Left: Logo & Project */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[var(--accent)]"
                    >
                        <path
                            d="M12 2L2 7L12 12L22 7L12 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M2 17L12 22L22 17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M2 12L12 17L22 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="font-semibold text-[var(--text-primary)]">ArchLab</span>
                </div>

                <div className="h-5 w-px bg-[var(--border)]" />

                <span className="text-sm text-[var(--text-secondary)]">{projectName}</span>
            </div>

            {/* Center: Version Selector */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onVersionChange}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--background-secondary)] border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--text-muted)] transition-colors"
                >
                    <span>v{versionNumber}</span>
                    <ChevronDown size={14} />
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <ThemeToggle />

                <button
                    onClick={onExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                    <Download size={16} />
                    <span className="hidden sm:inline">Export</span>
                </button>

                <button
                    onClick={onShare}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
                >
                    <Share2 size={16} />
                    <span className="hidden sm:inline">Share</span>
                </button>
            </div>
        </header>
    );
}
