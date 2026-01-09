'use client';

import { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, Maximize2, Download, Copy, Check } from 'lucide-react';

interface DiagramCanvasProps {
    diagram: string;
    diagramType: 'c4Context' | 'c4Container' | 'erd' | 'sequence';
}

const diagramLabels = {
    c4Context: 'C4 Context Diagram',
    c4Container: 'C4 Container Diagram',
    erd: 'Entity Relationship Diagram',
    sequence: 'Sequence Diagram',
};

export function DiagramCanvas({ diagram, diagramType }: DiagramCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(100);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Initialize mermaid with appropriate theme
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        mermaid.initialize({
            startOnLoad: false,
            theme: isDark ? 'dark' : 'default',
            themeVariables: isDark ? {
                primaryColor: '#6366f1',
                primaryTextColor: '#fafafa',
                primaryBorderColor: '#3f3f46',
                lineColor: '#71717a',
                secondaryColor: '#27272a',
                tertiaryColor: '#18181b',
            } : {
                primaryColor: '#6366f1',
                primaryTextColor: '#0f172a',
                primaryBorderColor: '#e2e8f0',
                lineColor: '#64748b',
                secondaryColor: '#f8fafc',
                tertiaryColor: '#f1f5f9',
            },
        });
    }, []);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!containerRef.current || !diagram) return;

            try {
                containerRef.current.innerHTML = '';
                setError(null);

                const id = `mermaid-${Date.now()}`;
                const { svg } = await mermaid.render(id, diagram);
                containerRef.current.innerHTML = svg;

                const svgElement = containerRef.current.querySelector('svg');
                if (svgElement) {
                    svgElement.style.width = '100%';
                    svgElement.style.height = 'auto';
                }
            } catch (err) {
                console.error('Mermaid error:', err);
                setError('Failed to render diagram. Check the syntax.');
            }
        };

        renderDiagram();
    }, [diagram]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(diagram);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

    if (!diagram) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[var(--background-tertiary)] rounded-[var(--radius-lg)] m-4">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                    </div>
                    <p className="text-[var(--text-tertiary)] text-sm">No diagram generated yet</p>
                    <p className="text-[var(--text-muted)] text-xs mt-1">Enter your requirements below to generate</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col m-4 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[var(--text-secondary)]">
                    {diagramLabels[diagramType]}
                </h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleZoomOut}
                        className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                        title="Zoom out"
                    >
                        <ZoomOut size={16} />
                    </button>
                    <span className="text-xs text-[var(--text-muted)] w-12 text-center">{zoom}%</span>
                    <button
                        onClick={handleZoomIn}
                        className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                        title="Zoom in"
                    >
                        <ZoomIn size={16} />
                    </button>
                    <div className="w-px h-4 bg-[var(--border)] mx-2" />
                    <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                        title="Copy Mermaid code"
                    >
                        {copied ? <Check size={16} className="text-[var(--success)]" /> : <Copy size={16} />}
                    </button>
                    <button
                        className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                        title="Download as PNG"
                    >
                        <Download size={16} />
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div
                className="diagram-canvas flex-1 p-6 overflow-auto"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            >
                {error ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                        <p className="text-[var(--error)] text-sm">{error}</p>
                        <pre className="text-xs text-[var(--text-muted)] max-w-md overflow-auto p-3 bg-[var(--surface)] rounded-[var(--radius-md)]">
                            {diagram.substring(0, 200)}...
                        </pre>
                    </div>
                ) : (
                    <div ref={containerRef} className="flex items-center justify-center min-h-[300px]" />
                )}
            </div>
        </div>
    );
}
