import React, { useState, useEffect } from 'react';
import { File, Folder, Download, Loader2, Copy, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui';

interface CodeHubProps {
    projectId: string;
    versionId: string;
}

interface TreeNode {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: TreeNode[];
    content?: string;
}

export function CodeHub({ projectId, versionId }: CodeHubProps) {
    const [files, setFiles] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [tree, setTree] = useState<TreeNode[]>([]);
    const [copying, setCopying] = useState(false);

    useEffect(() => {
        if (projectId && versionId) {
            loadCode();
        } else {
            setError('No project or version selected');
            setLoading(false);
        }
    }, [projectId, versionId]);

    const loadCode = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getCode(projectId, versionId);
            setFiles(data);

            // Build tree
            const root: TreeNode[] = [];
            Object.keys(data).forEach(path => {
                const parts = path.split('/');
                let currentLevel = root;

                parts.forEach((part, index) => {
                    const isFile = index === parts.length - 1;
                    const existing = currentLevel.find(n => n.name === part);

                    if (existing) {
                        if (existing.type === 'folder') {
                            currentLevel = existing.children!;
                        }
                    } else {
                        const newNode: TreeNode = {
                            name: part,
                            path: isFile ? path : parts.slice(0, index + 1).join('/'),
                            type: isFile ? 'file' : 'folder',
                            children: isFile ? undefined : []
                        };
                        currentLevel.push(newNode);
                        if (!isFile) {
                            currentLevel = newNode.children!;
                        }
                    }
                });
            });

            // Sort: folders first, then files
            const sortNodes = (nodes: TreeNode[]) => {
                nodes.sort((a, b) => {
                    if (a.type === b.type) return a.name.localeCompare(b.name);
                    return a.type === 'folder' ? -1 : 1;
                });
                nodes.forEach(n => {
                    if (n.children) sortNodes(n.children);
                });
            };
            sortNodes(root);
            setTree(root);

            // Select first file
            const firstFile = Object.keys(data)[0];
            if (firstFile) setSelectedFile(firstFile);

        } catch (err: any) {
            console.error('Failed to load code:', err);
            if (err.message?.includes('not found') || err.message?.includes('not generated')) {
                setError('Generate a design first to see the boilerplate code.');
            } else {
                setError(err.message || 'Failed to load code');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        window.location.href = api.getDownloadUrl(projectId, versionId);
    };

    const handleCopy = () => {
        if (!selectedFile || !files[selectedFile]) return;
        navigator.clipboard.writeText(files[selectedFile]);
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
    };

    // Recursive Tree Component
    const FileTreeItem = ({ node, level = 0 }: { node: TreeNode; level?: number }) => {
        const [isOpen, setIsOpen] = useState(true);
        const isSelected = node.path === selectedFile;

        if (node.type === 'folder') {
            return (
                <div>
                    <div
                        className="flex items-center gap-2 py-1 px-2 hover:bg-[var(--surface-hover)] cursor-pointer text-sm text-[var(--text-secondary)] select-none"
                        style={{ paddingLeft: `${level * 12 + 8}px` }}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Folder size={14} className={isOpen ? 'text-[var(--text-primary)]' : ''} />
                        <span className={isOpen ? 'text-[var(--text-primary)] font-medium' : ''}>{node.name}</span>
                    </div>
                    {isOpen && node.children?.map(child => (
                        <FileTreeItem key={child.path} node={child} level={level + 1} />
                    ))}
                </div>
            );
        }

        return (
            <div
                className={`flex items-center gap-2 py-1 px-2 cursor-pointer text-sm transition-colors ${isSelected
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                    }`}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={() => setSelectedFile(node.path)}
            >
                <File size={14} />
                <span>{node.name}</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-[var(--text-tertiary)]">
                <Loader2 size={32} className="animate-spin mb-4" />
                <p>Generating boilerplate code...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-[var(--text-tertiary)] p-8">
                <File size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium text-[var(--text-secondary)] mb-2">No Code Available</p>
                <p className="text-center max-w-md">{error}</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                        <File size={18} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">Project Code</h3>
                        <p className="text-xs text-[var(--text-muted)]">Generated boilerplate</p>
                    </div>
                </div>
                <Button onClick={handleDownload} size="sm">
                    <Download size={16} className="mr-2" />
                    Download ZIP
                </Button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - File Tree */}
                <div className="w-64 border-r border-[var(--border)] bg-[var(--background)] overflow-y-auto py-2">
                    {tree.map(node => (
                        <FileTreeItem key={node.path} node={node} />
                    ))}
                </div>

                {/* Main - Code Viewer */}
                <div className="flex-1 flex flex-col bg-[var(--background-secondary)] overflow-hidden">
                    {selectedFile ? (
                        <>
                            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)]">
                                <span className="text-sm font-mono text-[var(--text-secondary)]">{selectedFile}</span>
                                <button
                                    onClick={handleCopy}
                                    className="p-1.5 rounded-md hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors"
                                    title="Copy content"
                                >
                                    {copying ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto p-4">
                                <pre className="font-mono text-sm text-[var(--text-primary)]">
                                    <code>{files[selectedFile]}</code>
                                </pre>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[var(--text-tertiary)]">
                            Select a file to view content
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
