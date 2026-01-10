import { useState, useRef, useEffect } from 'react';
import { Download, Share2, ChevronDown, Menu, Check, FileJson, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ProjectVersion } from '@/lib/api';

interface HeaderProps {
    projectName?: string;
    versionNumber?: number;
    versions?: ProjectVersion[];
    onExportJson?: () => void;
    onExportMarkdown?: () => void;
    onShare?: () => void;
    onVersionSelect?: (version: ProjectVersion) => void;
}

export function Header({
    projectName = 'Untitled Project',
    versionNumber = 1,
    versions = [],
    onExportJson,
    onExportMarkdown,
    onShare,
    onVersionSelect,
}: HeaderProps) {
    const [isVersionOpen, setIsVersionOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const versionRef = useRef<HTMLDivElement>(null);
    const exportRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (versionRef.current && !versionRef.current.contains(event.target as Node)) {
                setIsVersionOpen(false);
            }
            if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
                setIsExportOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="workspace-header bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4 z-20 relative">
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
            <div className="relative" ref={versionRef}>
                <button
                    onClick={() => setIsVersionOpen(!isVersionOpen)}
                    disabled={!versions.length}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--background-secondary)] border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--text-muted)] transition-colors ${!versions.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span>v{versionNumber}</span>
                    <ChevronDown size={14} className={`transition-transformDuration-200 ${isVersionOpen ? 'rotate-180' : ''}`} />
                </button>

                {isVersionOpen && versions.length > 0 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                        {versions.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => {
                                    onVersionSelect?.(v);
                                    setIsVersionOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                            >
                                <span>Version {v.versionNumber}</span>
                                {v.versionNumber === versionNumber && (
                                    <Check size={14} className="text-[var(--accent)]" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <ThemeToggle />

                <div className="relative" ref={exportRef}>
                    <button
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Export</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isExportOpen && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                            <button
                                onClick={() => {
                                    onExportJson?.();
                                    setIsExportOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                            >
                                <FileJson size={14} className="text-[var(--text-secondary)]" />
                                <span>Export JSON</span>
                            </button>
                            <button
                                onClick={() => {
                                    onExportMarkdown?.();
                                    setIsExportOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                            >
                                <FileText size={14} className="text-[var(--text-secondary)]" />
                                <span>Export Markdown</span>
                            </button>
                        </div>
                    )}
                </div>

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
