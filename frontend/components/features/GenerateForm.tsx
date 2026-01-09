'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Textarea, Input, Modal } from '../ui';
import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateFormProps {
    onGenerate: (requirements: string, projectName?: string) => Promise<void>;
    isLoading?: boolean;
    showProjectName?: boolean;
}

const examplePrompts = [
    "E-commerce platform with user authentication, product catalog, shopping cart, and payment processing",
    "Real-time chat application with rooms, private messaging, and file sharing",
    "Task management system with team collaboration, deadlines, and notifications",
    "Video streaming platform with content management, user subscriptions, and analytics",
];

export function GenerateForm({ onGenerate, isLoading, showProjectName = false }: GenerateFormProps) {
    const [requirements, setRequirements] = useState('');
    const [projectName, setProjectName] = useState('');
    const [showExamples, setShowExamples] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requirements.trim()) return;
        await onGenerate(requirements, showProjectName ? projectName : undefined);
    };

    const handleExampleClick = (example: string) => {
        setRequirements(example);
        setShowExamples(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {showProjectName && (
                <Input
                    label="Project Name"
                    placeholder="My Awesome Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={isLoading}
                />
            )}

            <div className="relative">
                <Textarea
                    label="System Requirements"
                    placeholder="Describe your system requirements in detail. Include features, user roles, integrations, and any constraints..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    disabled={isLoading}
                    className="min-h-[160px]"
                    hint="Be specific about features, scale requirements, and technology preferences"
                />

                <button
                    type="button"
                    onClick={() => setShowExamples(!showExamples)}
                    className="absolute right-3 top-8 text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                >
                    See examples
                </button>
            </div>

            {showExamples && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                >
                    <p className="text-xs text-[var(--text-tertiary)]">Click to use an example:</p>
                    <div className="flex flex-wrap gap-2">
                        {examplePrompts.map((example, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleExampleClick(example)}
                                className="text-xs px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-all text-left"
                            >
                                {example.substring(0, 50)}...
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={isLoading}
                disabled={!requirements.trim() || isLoading}
                icon={isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            >
                {isLoading ? 'Generating Architecture...' : 'Generate System Design'}
            </Button>
        </form>
    );
}
