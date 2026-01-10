'use client';

import { useState } from 'react';
import {
    Cloud,
    ShoppingCart,
    MessageCircle,
    Server,
    Smartphone,
    FileText,
    Activity,
    Users,
    Sparkles,
    ChevronRight
} from 'lucide-react';

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Cloud,
    ShoppingCart,
    MessageCircle,
    Server,
    Smartphone,
    FileText,
    Activity,
    Users,
};

export interface Template {
    id: string;
    name: string;
    icon: string;
    category: 'web' | 'mobile' | 'enterprise' | 'realtime';
    description: string;
    techStack: string[];
    requirements: string;
}

interface TemplateSelectorProps {
    templates: Template[];
    onSelect: (template: Template) => void;
    isLoading?: boolean;
}

const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'web', label: 'Web Apps' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'enterprise', label: 'Enterprise' },
    { id: 'realtime', label: 'Real-time' },
];

const categoryColors: Record<string, string> = {
    web: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    mobile: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    enterprise: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    realtime: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
};

const categoryBadgeColors: Record<string, string> = {
    web: 'bg-blue-500/20 text-blue-400',
    mobile: 'bg-purple-500/20 text-purple-400',
    enterprise: 'bg-emerald-500/20 text-emerald-400',
    realtime: 'bg-orange-500/20 text-orange-400',
};

export function TemplateSelector({ templates, onSelect, isLoading }: TemplateSelectorProps) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

    const filteredTemplates = activeCategory === 'all'
        ? templates
        : templates.filter(t => t.category === activeCategory);

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)]/10 rounded-full mb-4">
                    <Sparkles size={14} className="text-[var(--accent)]" />
                    <span className="text-xs font-medium text-[var(--accent)]">Quick Start Templates</span>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    Choose a Template to Get Started
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                    Select a pre-built architecture template or describe your system from scratch below
                </p>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center justify-center gap-1 mb-6 p-1 bg-[var(--surface)] rounded-lg w-fit mx-auto">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeCategory === cat.id
                                ? 'bg-[var(--accent)] text-white'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => {
                    const Icon = iconMap[template.icon] || Server;
                    const isHovered = hoveredTemplate === template.id;

                    return (
                        <button
                            key={template.id}
                            onClick={() => onSelect(template)}
                            onMouseEnter={() => setHoveredTemplate(template.id)}
                            onMouseLeave={() => setHoveredTemplate(null)}
                            disabled={isLoading}
                            className={`
                                group relative p-4 rounded-xl border text-left transition-all duration-300
                                bg-gradient-to-br ${categoryColors[template.category]}
                                hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--accent)]/10
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-lg bg-[var(--background)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Icon size={20} className="text-[var(--accent)]" />
                            </div>

                            {/* Title & Description */}
                            <h4 className="font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                                {template.name}
                                <ChevronRight
                                    size={14}
                                    className={`text-[var(--accent)] transition-all ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
                                />
                            </h4>
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                                {template.description}
                            </p>

                            {/* Category Badge */}
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${categoryBadgeColors[template.category]}`}>
                                {template.category}
                            </span>

                            {/* Tech Stack Tooltip */}
                            {isHovered && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-xl z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                        Suggested Tech Stack
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {template.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-0.5 text-xs bg-[var(--background)] text-[var(--text-secondary)] rounded"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-xs text-[var(--text-muted)]">or describe from scratch</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
            </div>
        </div>
    );
}
