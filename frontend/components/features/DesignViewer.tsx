'use client';

import { motion } from 'framer-motion';
import { Design } from '@/lib/api';
import { Card, CardContent, CardHeader } from '../ui';
// import { MermaidDiagram } from './MermaidDiagram';
import { InteractiveDiagram } from './InteractiveDiagram';
import {
    Users,
    CheckSquare,
    Shield,
    Lightbulb,
    Layers,
    Box,
    Database,
    Code,
    GitBranch,
    Network,
    FileCode,
    Workflow,
} from 'lucide-react';
import { useState } from 'react';

interface DesignViewerProps {
    design: Design;
    versionNumber?: number;
}

type TabId = 'overview' | 'components' | 'data' | 'api' | 'diagrams';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Layers size={16} /> },
    { id: 'components', label: 'Components', icon: <Box size={16} /> },
    { id: 'data', label: 'Data Model', icon: <Database size={16} /> },
    { id: 'api', label: 'API', icon: <Code size={16} /> },
    { id: 'diagrams', label: 'Diagrams', icon: <Workflow size={16} /> },
];

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

export function DesignViewer({ design, versionNumber }: DesignViewerProps) {
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 p-1 bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)]
              text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                                ? 'bg-[var(--accent)] text-white shadow-md'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                            }
            `}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'overview' && <OverviewTab design={design} />}
                {activeTab === 'components' && <ComponentsTab components={design.components} />}
                {activeTab === 'data' && <DataModelTab dataModel={design.dataModel} />}
                {activeTab === 'api' && <ApiTab api={design.api} />}
                {activeTab === 'diagrams' && <DiagramsTab diagrams={design.diagrams} />}
            </motion.div>
        </div>
    );
}

export function OverviewTab({ design }: { design: Design }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
            {/* Architecture Pattern */}
            <motion.div variants={itemVariants}>
                <Card glow className="h-full">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-[var(--radius-md)] bg-[var(--accent-muted)]">
                                <GitBranch className="text-[var(--accent)]" size={20} />
                            </div>
                            <h3 className="text-lg font-semibold">Architecture Pattern</h3>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold gradient-text mb-4">{design.architecture.pattern}</p>
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Rationale</h4>
                                <ul className="space-y-1">
                                    {design.architecture.rationale.map((item, idx) => (
                                        <li key={idx} className="text-sm text-[var(--text-tertiary)] flex items-start gap-2">
                                            <span className="text-[var(--success)] mt-1">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Risks</h4>
                                <ul className="space-y-1">
                                    {design.architecture.risks.map((item, idx) => (
                                        <li key={idx} className="text-sm text-[var(--text-tertiary)] flex items-start gap-2">
                                            <span className="text-[var(--warning)] mt-1">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Requirements Summary */}
            <motion.div variants={itemVariants}>
                <Card className="h-full">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-[var(--radius-md)] bg-[var(--success-muted)]">
                                <CheckSquare className="text-[var(--success)]" size={20} />
                            </div>
                            <h3 className="text-lg font-semibold">Requirements</h3>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Users size={14} className="text-[var(--accent)]" />
                                <h4 className="text-sm font-medium text-[var(--text-secondary)]">Actors</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {design.requirements.actors.map((actor, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 text-xs bg-[var(--accent-muted)] text-[var(--accent)] rounded-[var(--radius-sm)]"
                                    >
                                        {actor}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <CheckSquare size={14} className="text-[var(--success)]" />
                                <h4 className="text-sm font-medium text-[var(--text-secondary)]">Functional ({design.requirements.functional.length})</h4>
                            </div>
                            <ul className="space-y-1 max-h-24 overflow-y-auto">
                                {design.requirements.functional.slice(0, 4).map((req, idx) => (
                                    <li key={idx} className="text-xs text-[var(--text-tertiary)]">• {req}</li>
                                ))}
                                {design.requirements.functional.length > 4 && (
                                    <li className="text-xs text-[var(--accent)]">+{design.requirements.functional.length - 4} more</li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Shield size={14} className="text-[var(--warning)]" />
                                <h4 className="text-sm font-medium text-[var(--text-secondary)]">Non-Functional ({design.requirements.nfr.length})</h4>
                            </div>
                            <ul className="space-y-1 max-h-24 overflow-y-auto">
                                {design.requirements.nfr.slice(0, 3).map((req, idx) => (
                                    <li key={idx} className="text-xs text-[var(--text-tertiary)]">• {req}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Assumptions */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-[var(--radius-md)] bg-yellow-500/10">
                                <Lightbulb className="text-yellow-500" size={20} />
                            </div>
                            <h3 className="text-lg font-semibold">Assumptions</h3>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {design.requirements.assumptions.map((assumption, idx) => (
                                <div key={idx} className="text-sm text-[var(--text-tertiary)] flex items-start gap-2">
                                    <span className="text-yellow-500 mt-0.5">→</span>
                                    {assumption}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}

export function ComponentsTab({ components }: { components: Design['components'] }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
            {components.map((component, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                    <Card hover className="h-full">
                        <CardContent>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-[var(--radius-md)] bg-[var(--accent-muted)]">
                                    <Box className="text-[var(--accent)]" size={18} />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">{component.name}</h4>
                            </div>
                            <ul className="space-y-1.5">
                                {component.responsibilities.map((resp, rIdx) => (
                                    <li key={rIdx} className="text-sm text-[var(--text-tertiary)] flex items-start gap-2">
                                        <span className="text-[var(--accent)] mt-1 text-xs">•</span>
                                        {resp}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}

export function DataModelTab({ dataModel }: { dataModel: Design['dataModel'] }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
            {dataModel.map((entity, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                    <Card className="h-full">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-[var(--radius-md)] bg-blue-500/10">
                                    <Database className="text-blue-400" size={18} />
                                </div>
                                <h4 className="font-semibold text-[var(--text-primary)]">{entity.entity}</h4>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="space-y-2">
                                {entity.fields.map((field, fIdx) => (
                                    <div key={fIdx} className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)] last:border-0">
                                        <span className="text-sm text-[var(--text-secondary)]">{field.name}</span>
                                        <span className="text-xs px-2 py-0.5 bg-[var(--surface-hover)] text-[var(--text-tertiary)] rounded font-mono">
                                            {field.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}

export function ApiTab({ api }: { api: Design['api'] }) {
    const methodColors: Record<string, string> = {
        GET: 'bg-green-500/20 text-green-400',
        POST: 'bg-blue-500/20 text-blue-400',
        PUT: 'bg-yellow-500/20 text-yellow-400',
        PATCH: 'bg-orange-500/20 text-orange-400',
        DELETE: 'bg-red-500/20 text-red-400',
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
        >
            {api.map((endpoint, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                    <Card hover>
                        <CardContent className="py-3">
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[endpoint.method] || 'bg-gray-500/20 text-gray-400'}`}>
                                    {endpoint.method}
                                </span>
                                <code className="text-sm font-mono text-[var(--text-primary)]">{endpoint.path}</code>
                                <span className="text-sm text-[var(--text-tertiary)] flex-1">{endpoint.purpose}</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}

export function DiagramsTab({ diagrams }: { diagrams: any }) {
    // Note: Cast to 'any' temporarily or update your 'Design' type in api.ts

    const diagramList = [
        { key: 'c4Context', title: 'C4 Context Diagram', icon: <Network size={16} /> },
        { key: 'c4Container', title: 'C4 Container Diagram', icon: <Box size={16} /> },
        { key: 'erd', title: 'Entity Relationship Diagram', icon: <Database size={16} /> },
        { key: 'sequence', title: 'Component Interaction Map', icon: <FileCode size={16} /> },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8" // Increased spacing for better view
        >
            {diagramList.map(({ key, title }) => {
                const data = diagrams[key];

                // Safety check: ensure data exists before rendering
                if (!data || !data.nodes) return null;

                return (
                    <motion.div key={key} variants={itemVariants}>
                        <InteractiveDiagram
                            data={data}
                            title={title}
                        />
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
