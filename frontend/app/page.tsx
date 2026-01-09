'use client';

import { useState, useEffect } from 'react';
import { Sidebar, Header } from '@/components/layout';
import { ChatInput, DiagramCanvas } from '@/components/features';
import { Button, Modal, Input } from '@/components/ui';
import { api, Project, ProjectVersion, Design } from '@/lib/api';
import { Network, Box, Database, FileCode, Loader2, Plus, FolderOpen } from 'lucide-react';

type DiagramType = 'c4Context' | 'c4Container' | 'erd' | 'sequence';

const diagramTabs = [
  { id: 'c4Context' as DiagramType, label: 'C4 Context', icon: Network },
  { id: 'c4Container' as DiagramType, label: 'C4 Container', icon: Box },
  { id: 'erd' as DiagramType, label: 'ERD', icon: Database },
  { id: 'sequence' as DiagramType, label: 'Sequence', icon: FileCode },
];

export default function Home() {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentVersion, setCurrentVersion] = useState<ProjectVersion | null>(null);
  const [design, setDesign] = useState<Design | null>(null);
  const [activeDiagram, setActiveDiagram] = useState<DiagramType>('c4Context');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
      // Auto-select first project if exists
      if (data.length > 0 && !selectedProject) {
        handleSelectProject(data[0]);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleSelectProject = async (project: Project) => {
    setSelectedProject(project);
    setShowProjectSelector(false);

    // Try to load latest version's design
    try {
      const versions = await api.getVersions(project.id);
      if (versions.length > 0) {
        const latestVersion = versions[0];
        setCurrentVersion(latestVersion);

        try {
          const designData = await api.getDesign(project.id, latestVersion.id);
          setDesign(designData.design);
        } catch {
          // No design yet
          setDesign(null);
        }
      }
    } catch (err) {
      console.error('Failed to load versions:', err);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      setIsLoading(true);
      const project = await api.createProject({ name: newProjectName });
      setProjects([project, ...projects]);
      setSelectedProject(project);
      setCurrentVersion(null);
      setDesign(null);
      setNewProjectName('');
      setShowNewProject(false);
    } catch (err) {
      setError('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDesign = async (requirements: string) => {
    if (!selectedProject) {
      // Create a new project first
      setShowNewProject(true);
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // Create version and generate
      const version = await api.createVersion(selectedProject.id, requirements);
      const updatedVersion = await api.generateDesign(selectedProject.id, version.id);
      const designData = await api.getDesign(selectedProject.id, version.id);

      setCurrentVersion(updatedVersion);
      setDesign(designData.design);
    } catch (err: any) {
      setError(err.message || 'Failed to generate design');
    } finally {
      setIsGenerating(false);
    }
  };

  // No project selected - show welcome screen
  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-6">
            <Network size={32} className="text-[var(--accent)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Welcome to ArchLab
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            AI-powered system design. Describe your requirements and get complete architecture diagrams, documentation, and API specs.
          </p>

          <div className="flex flex-col gap-3">
            <Button onClick={() => setShowNewProject(true)} size="lg" className="w-full">
              <Plus size={18} className="mr-2" />
              Create New Project
            </Button>
            {projects.length > 0 && (
              <Button onClick={() => setShowProjectSelector(true)} variant="secondary" size="lg" className="w-full">
                <FolderOpen size={18} className="mr-2" />
                Open Existing Project
              </Button>
            )}
          </div>
        </div>

        {/* New Project Modal */}
        <Modal isOpen={showNewProject} onClose={() => setShowNewProject(false)} title="Create New Project">
          <div className="space-y-4">
            <Input
              label="Project Name"
              placeholder="E.g., E-commerce Platform"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowNewProject(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreateProject} loading={isLoading} disabled={!newProjectName.trim()} className="flex-1">
                Create Project
              </Button>
            </div>
          </div>
        </Modal>

        {/* Project Selector Modal */}
        <Modal isOpen={showProjectSelector} onClose={() => setShowProjectSelector(false)} title="Select Project" size="lg">
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleSelectProject(project)}
                className="w-full p-4 text-left rounded-[var(--radius-lg)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface-hover)] transition-all"
              >
                <h3 className="font-medium text-[var(--text-primary)]">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-[var(--text-tertiary)] mt-1">{project.description}</p>
                )}
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </Modal>
      </div>
    );
  }

  // Main workspace view
  return (
    <div className="workspace-layout">
      <Header
        projectName={selectedProject.name}
        versionNumber={currentVersion?.versionNumber || 1}
      />

      <Sidebar
        projectName={selectedProject.name}
        onNewProject={() => setShowNewProject(true)}
      />

      <main className="workspace-main bg-[var(--background)]">
        {/* Diagram Tabs */}
        <div className="flex items-center gap-1 px-4 pt-4 border-b border-[var(--border)]">
          {diagramTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDiagram(tab.id)}
                className={`diagram-tab flex items-center gap-1.5 ${activeDiagram === tab.id ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Diagram Canvas */}
        {isGenerating ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 size={32} className="animate-spin text-[var(--accent)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">Generating system design...</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">This may take a moment</p>
            </div>
          </div>
        ) : (
          <DiagramCanvas
            diagram={design?.diagrams?.[activeDiagram] || ''}
            diagramType={activeDiagram}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-4 mb-4 p-3 bg-[var(--error-muted)] border border-[var(--error)] rounded-[var(--radius-md)] text-[var(--error)] text-sm">
            {error}
          </div>
        )}

        {/* Chat Input */}
        <ChatInput
          onSubmit={handleGenerateDesign}
          isLoading={isGenerating}
          placeholder={design ? "Request changes to the design..." : "Describe your system requirements..."}
        />
      </main>

      {/* New Project Modal */}
      <Modal isOpen={showNewProject} onClose={() => setShowNewProject(false)} title="Create New Project">
        <div className="space-y-4">
          <Input
            label="Project Name"
            placeholder="E.g., E-commerce Platform"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowNewProject(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreateProject} loading={isLoading} disabled={!newProjectName.trim()} className="flex-1">
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
