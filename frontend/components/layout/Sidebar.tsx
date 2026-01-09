'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Network,
    Box,
    Database,
    Code,
    FileText,
    GitBranch,
    Settings,
    Plus,
    ChevronDown,
} from 'lucide-react';

interface SidebarProps {
    projectName?: string;
    activeView: string;
    onNavigate: (viewId: string) => void;
    onNewProject?: () => void;
    onProjectClick?: () => void;
}

const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
        id: 'diagrams', label: 'Diagrams', icon: Network, children: [
            { id: 'c4Context', label: 'C4 Context' },
            { id: 'c4Container', label: 'C4 Container' },
            { id: 'erd', label: 'ERD' },
            { id: 'sequence', label: 'Sequence' },
        ]
    },
    { id: 'components', label: 'Components', icon: Box },
    { id: 'dataModel', label: 'Data Model', icon: Database },
    { id: 'api', label: 'API Spec', icon: Code },
    { id: 'docs', label: 'Documentation', icon: FileText },
    { id: 'versions', label: 'Versions', icon: GitBranch },
];

export function Sidebar({ projectName, activeView, onNavigate, onNewProject, onProjectClick }: SidebarProps) {
    // Determine if a parent item should be highlighted
    const isParentActive = (item: typeof navItems[0]) => {
        if (item.id === activeView) return true;
        if (item.children) {
            return item.children.some(child => child.id === activeView);
        }
        // Also highlight 'diagrams' if any specific diagram type is selected but activeView might be generic 'diagrams'
        if (item.id === 'diagrams' && ['c4Context', 'c4Container', 'erd', 'sequence'].includes(activeView)) return true;
        return false;
    };

    return (
        <aside className="workspace-sidebar bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col overflow-hidden">
            {/* Project Selector */}
            <div className="p-3 border-b border-[var(--border)]">
                <button
                    type="button"
                    onClick={onProjectClick}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--sidebar-hover)] transition-colors text-left group"
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-[var(--radius-sm)] bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                                {projectName?.[0]?.toUpperCase() || 'A'}
                            </span>
                        </div>
                        <span className="font-medium text-[var(--text-primary)] truncate text-sm">
                            {projectName || 'Select Project'}
                        </span>
                    </div>
                    <ChevronDown size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-tertiary)] flex-shrink-0" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-2">
                <ul className="space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = isParentActive(item);
                        const Icon = item.icon;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onNavigate(item.id)}
                                    className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)]
                    text-sm font-medium transition-colors
                    ${isActive
                                            ? 'bg-[var(--sidebar-active)] text-[var(--accent)]'
                                            : 'text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--text-primary)]'
                                        }
                  `}
                                >
                                    <Icon size={16} className="flex-shrink-0" />
                                    <span>{item.label}</span>
                                </button>

                                {/* Sub-items for Diagrams */}
                                {item.id === 'diagrams' && (isActive || activeView === 'diagrams') && (
                                    <ul className="ml-7 mt-0.5 space-y-0.5">
                                        {item.children?.map((child) => (
                                            <li key={child.id}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onNavigate(child.id);
                                                    }}
                                                    className={`
                            w-full text-left px-3 py-1.5 rounded-[var(--radius-sm)]
                            text-xs font-medium transition-colors
                            ${activeView === child.id
                                                            ? 'text-[var(--accent)] bg-[var(--sidebar-active)]'
                                                            : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)]'
                                                        }
                          `}
                                                >
                                                    {child.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-[var(--border)]">
                <button
                    onClick={onNewProject}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--accent)] hover:bg-[var(--sidebar-active)] transition-colors"
                >
                    <Plus size={16} />
                    <span>New Project</span>
                </button>
            </div>
        </aside>
    );
}
