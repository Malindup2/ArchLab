import { Design } from '@/lib/api';
import { Card, CardContent } from '@/components/ui';

interface DocumentationTabProps {
    design: Design;
    projectName?: string;
}

export function DocumentationTab({ design, projectName = 'System Design' }: DocumentationTabProps) {
    const { requirements, architecture, components, dataModel, api } = design;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Title Section */}
            <div className="text-center border-b border-[var(--border)] pb-6">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{projectName}</h1>
                <p className="text-[var(--text-tertiary)]">Architecture Design Document</p>
            </div>

            {/* 1. Overview */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <span className="text-[var(--accent)]">1.</span> System Overview
                </h2>

                <Card>
                    <CardContent className="pt-6 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Architecture Pattern</h3>
                            <p className="text-lg font-medium text-[var(--text-primary)]">{architecture.pattern}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Rationale</h3>
                                <ul className="list-disc list-outside ml-4 text-[var(--text-secondary)] space-y-1">
                                    {architecture.rationale.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Risks</h3>
                                <ul className="list-disc list-outside ml-4 text-[var(--text-secondary)] space-y-1">
                                    {architecture.risks.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* 2. Requirements */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <span className="text-[var(--accent)]">2.</span> Requirements
                </h2>

                <Card>
                    <CardContent className="pt-6 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Actors</h3>
                            <div className="flex flex-wrap gap-2">
                                {requirements.actors.map((a, i) => (
                                    <span key={i} className="px-2 py-1 bg-[var(--surface-hover)] rounded text-[var(--text-primary)] text-sm border border-[var(--border)]">
                                        {a}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Functional</h3>
                                <ul className="list-disc list-outside ml-4 text-[var(--text-secondary)] space-y-1">
                                    {requirements.functional.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Non-Functional</h3>
                                <ul className="list-disc list-outside ml-4 text-[var(--text-secondary)] space-y-1">
                                    {requirements.nfr.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Assumptions</h3>
                            <ul className="list-disc list-outside ml-4 text-[var(--text-secondary)] space-y-1">
                                {requirements.assumptions.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* 3. Components */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <span className="text-[var(--accent)]">3.</span> Component Architecture
                </h2>

                <div className="grid gap-4">
                    {components.map((comp, i) => (
                        <Card key={i}>
                            <CardContent className="pt-4">
                                <h3 className="font-bold text-[var(--text-primary)] mb-2">{comp.name}</h3>
                                <ul className="list-disc list-outside ml-4 text-[var(--text-secondary)] space-y-1">
                                    {comp.responsibilities.map((r, j) => <li key={j}>{r}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 4. Data Model */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <span className="text-[var(--accent)]">4.</span> Data Model
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    {dataModel.map((entity, i) => (
                        <Card key={i}>
                            <CardContent className="pt-4">
                                <h3 className="font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                    {entity.entity}
                                </h3>
                                <div className="space-y-1">
                                    {entity.fields.map((f, j) => (
                                        <div key={j} className="flex justify-between text-sm py-1 border-b border-[var(--border-subtle)] last:border-0">
                                            <span className="text-[var(--text-secondary)]">{f.name}</span>
                                            <span className="font-mono text-xs text-[var(--text-tertiary)]">{f.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 5. API */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <span className="text-[var(--accent)]">5.</span> API Specification
                </h2>

                <Card>
                    <CardContent className="pt-0 p-0 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                                <tr>
                                    <th className="p-3 font-medium text-[var(--text-tertiary)]">Method</th>
                                    <th className="p-3 font-medium text-[var(--text-tertiary)]">Path</th>
                                    <th className="p-3 font-medium text-[var(--text-tertiary)]">Purpose</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {api.map((endpoint, i) => (
                                    <tr key={i} className="hover:bg-[var(--surface-hover)] transition-colors">
                                        <td className="p-3 font-mono font-bold text-[var(--text-primary)]">{endpoint.method}</td>
                                        <td className="p-3 font-mono text-[var(--text-secondary)]">{endpoint.path}</td>
                                        <td className="p-3 text-[var(--text-secondary)]">{endpoint.purpose}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
