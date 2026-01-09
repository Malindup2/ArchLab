'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/api';
import { Card, CardContent } from '../ui';
import { Folder, Clock, GitBranch, ChevronRight } from 'lucide-react';

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
    const latestVersion = project.versions?.[0];
    const versionCount = project.versions?.length || 0;

    return (
        <Card hover onClick={onClick}>
            <CardContent className="py-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--accent-muted)] to-transparent">
                            <Folder className="text-[var(--accent)]" size={24} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                                {project.name}
                            </h3>
                            {project.description && (
                                <p className="text-sm text-[var(--text-tertiary)] line-clamp-2 max-w-md">
                                    {project.description}
                                </p>
                            )}
                            <div className="flex items-center gap-4 pt-2">
                                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                                    <GitBranch size={12} />
                                    <span>{versionCount} version{versionCount !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                                    <Clock size={12} />
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" size={20} />
                </div>
            </CardContent>
        </Card>
    );
}
