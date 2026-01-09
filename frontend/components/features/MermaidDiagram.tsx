'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { motion } from 'framer-motion';
import { Maximize2, Copy, Check } from 'lucide-react';

interface MermaidDiagramProps {
    chart: string;
    title?: string;
    className?: string;
}

// Initialize mermaid with dark theme
mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'dark',
    themeVariables: {
        primaryColor: '#8b5cf6',
        primaryTextColor: '#fafafa',
        primaryBorderColor: '#27272a',
        lineColor: '#71717a',
        secondaryColor: '#1c1c1f',
        tertiaryColor: '#18181b',
        background: '#0a0a0b',
        mainBkg: '#1c1c1f',
        textColor: '#fafafa',
        fontSize: '14px',
    },
    flowchart: {
        curve: 'basis',
        padding: 20,
    },
});

export function MermaidDiagram({ chart, title, className = '' }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!containerRef.current || !chart) return;

            try {
                // Clear previous content
                containerRef.current.innerHTML = '';
                setError(null);

                // Generate unique ID
                const id = `mermaid-${Math.random().toString(36).substring(7)}`;

                // Render the diagram
                const { svg } = await mermaid.render(id, chart);
                containerRef.current.innerHTML = svg;

                // Style the SVG
                const svgElement = containerRef.current.querySelector('svg');
                if (svgElement) {
                    svgElement.style.width = '100%';
                    svgElement.style.height = 'auto';
                    svgElement.style.maxHeight = isFullscreen ? '80vh' : '400px';
                }
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError('Failed to render diagram');
            }
        };

        renderDiagram();
    }, [chart, isFullscreen]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(chart);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!chart) {
        return (
            <div className="flex items-center justify-center h-40 bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)]">
                <span className="text-[var(--text-tertiary)]">No diagram available</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative group ${className}`}
        >
            {title && (
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-[var(--text-secondary)]">{title}</h4>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                            title="Copy Mermaid code"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                            title="Toggle fullscreen"
                        >
                            <Maximize2 size={14} />
                        </button>
                    </div>
                </div>
            )}

            <div
                className={`
          relative overflow-auto
          bg-[var(--background-tertiary)]
          border border-[var(--border-subtle)]
          rounded-[var(--radius-lg)]
          p-4
          ${isFullscreen ? 'fixed inset-4 z-50 bg-[var(--background)]' : ''}
        `}
            >
                {error ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                        <span className="text-[var(--error)]">{error}</span>
                        <pre className="text-xs text-[var(--text-tertiary)] max-w-full overflow-auto p-2 bg-[var(--surface)] rounded">
                            {chart.substring(0, 200)}...
                        </pre>
                    </div>
                ) : (
                    <div ref={containerRef} className="flex items-center justify-center min-h-[200px]" />
                )}
            </div>

            {isFullscreen && (
                <button
                    onClick={() => setIsFullscreen(false)}
                    className="fixed top-6 right-6 z-50 p-2 bg-[var(--surface)] rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                    <Maximize2 size={20} />
                </button>
            )}
        </motion.div>
    );
}
