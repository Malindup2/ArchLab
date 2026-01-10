'use client';

import { useState, useEffect } from 'react';
import { Sidebar, Header } from '@/components/layout';
import { ChatInput, InteractiveDiagram, OverviewTab, ComponentsTab, DataModelTab, ApiTab, DocumentationTab, TemplateSelector, Template, CodeHub } from '@/components/features';
import { generateMarkdown } from '@/lib/markdown-generator';
import { Button, Modal, Input } from '@/components/ui';
import { api, Project, ProjectVersion, Design, ArchitectureTemplate } from '@/lib/api';
import { Network, Box, Database, FileCode, Loader2, Plus, FolderOpen, Layers, FileText, GitBranch } from 'lucide-react';

type ViewType = 'overview' | 'components' | 'dataModel' | 'api' | 'code' | 'docs' | 'versions' | 'diagrams' | 'c4Context' | 'c4Container' | 'erd' | 'sequence';

const diagramTabs = [
  { id: 'c4Context', label: 'C4 Context', icon: Network },
  { id: 'c4Container', label: 'C4 Container', icon: Box },
  { id: 'erd', label: 'ERD', icon: Database },
  { id: 'sequence', label: 'Sequence', icon: FileCode },
];

export default function Home() {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<ProjectVersion | null>(null);
  const [design, setDesign] = useState<Design | null>(null);

  // View State
  const [activeView, setActiveView] = useState<ViewType>('overview');

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<ArchitectureTemplate[]>([]);

  // Load projects and templates on mount
  useEffect(() => {
    loadProjects();
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await api.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  };

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

    // Try to load versions
    try {
      const versionsData = await api.getVersions(project.id);
      setVersions(versionsData); // Store all versions

      if (versionsData.length > 0) {
        // Default to latest
        const latestVersion = versionsData[0];
        setCurrentVersion(latestVersion);

        try {
          const designData = await api.getDesign(project.id, latestVersion.id);
          setDesign(designData.design);
        } catch {
          setDesign(null);
        }
      } else {
        setDesign(null);
        setCurrentVersion(null);
      }
    } catch (err) {
      console.error('Failed to load versions:', err);
    }
  };

  const handleVersionSelect = async (version: ProjectVersion) => {
    if (!selectedProject) return;

    // Optimistic update
    setCurrentVersion(version);
    setIsLoading(true);

    try {
      const designData = await api.getDesign(selectedProject.id, version.id);
      setDesign(designData.design);
    } catch (err) {
      console.error('Failed to load design for version:', err);
      setError('Failed to load design for this version');
      setDesign(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      setIsLoading(true);
      const project = await api.createProject({ name: newProjectName });
      // Ensure local list is in sync
      setProjects((prev) => [project, ...prev]);
      // Use the same flow as manual selection so versions/design state is consistent
      await handleSelectProject(project);
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
      setShowNewProject(true);
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // REFINEMENT MODE: If design already exists, refine it
      if (design && currentVersion) {
        const updatedVersion = await api.refineDesign(
          selectedProject.id,
          currentVersion.id,
          requirements //refinement request
        );

        // Refresh versions list to include the new one (if refinement creates new version)
        // Note: Backend refine creates new version? Wait, my refine implementation in backend UPDATED the version. 
        // Actually, refineDesign in backend: `updated = await prisma.projectVersion.update(...)`
        // So no new version is created in the DB, it updates the CURRENT version. 
        // Wait, versioning strategy should be iterative?
        // IF refinement updates in place, then we just reload.
        // IF we want history, we should create new version.
        // For now, let's assume in-place update as per previous implementation task.

        const designData = await api.getDesign(selectedProject.id, updatedVersion.id);
        setDesign(designData.design);
        // Stay on current view after refinement
      } else {
        // INITIAL GENERATION: Create version and generate from scratch
        const version = await api.createVersion(selectedProject.id, requirements);
        const updatedVersion = await api.generateDesign(selectedProject.id, version.id);
        const designData = await api.getDesign(selectedProject.id, version.id);

        // Update versions list
        const newVersions = await api.getVersions(selectedProject.id);
        setVersions(newVersions);

        setCurrentVersion(updatedVersion);
        setDesign(designData.design);

        // Navigate to diagrams after initial generation
        setActiveView('c4Context');
      }
    } catch (err: any) {
      let msg = err.message || 'Failed to generate design';
      // Nicer error for quota limits
      if (msg.includes('429')) {
        msg = 'Gemini API Quota Exceeded (429). Please try again later or check your API key plan.';
      }
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNavigate = (viewId: string) => {
    // If parent 'diagrams' clicked, default to context
    if (viewId === 'diagrams') {
      setActiveView('c4Context');
    } else {
      setActiveView(viewId as ViewType);
    }
  };

  const handleExportJson = () => {
    if (!design) return;
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedProject?.name.toLowerCase().replace(/\s+/g, '-')}-v${currentVersion?.versionNumber || 1}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!design) return;
    const md = generateMarkdown(design, selectedProject?.name);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedProject?.name.toLowerCase().replace(/\s+/g, '-')}-architecture.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to determine if we are in diagram mode
  const isDiagramMode = ['c4Context', 'c4Container', 'erd', 'sequence', 'diagrams'].includes(activeView);

  // Main workspace view (always show layout; handle empty state inside)
  return (
    <div className="workspace-layout">
      <Header
        projectName={selectedProject?.name}
        versionNumber={currentVersion?.versionNumber || 1}
        versions={versions}
        onVersionSelect={handleVersionSelect}
        onExportJson={handleExportJson}
        onExportMarkdown={handleExportMarkdown}
        onShare={() => { }}
      />

      <Sidebar
        projectName={selectedProject?.name}
        activeView={activeView}
        onNavigate={handleNavigate}
        onNewProject={() => setShowNewProject(true)}
        onProjectClick={() => setShowProjectSelector(true)}
      />

      <main className="workspace-main bg-[var(--background)] flex flex-col relative overflow-hidden">
        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-50 bg-[var(--background)]/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Loader2 size={32} className="animate-spin text-[var(--accent)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">Generating system design...</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">This may take a moment</p>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* If no project yet, show onboarding inside layout */}
          {!selectedProject ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Network size={48} className="text-[var(--accent)] mb-4" />
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">Welcome to ArchLab</h3>
              <p className="text-[var(--text-secondary)] max-w-md mt-2">
                Create a project to start generating AI-powered system designs, diagrams, and documentation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button onClick={() => setShowNewProject(true)} size="lg">
                  <Plus size={18} className="mr-2" />
                  Create New Project
                </Button>
                {projects.length > 0 && (
                  <Button
                    onClick={() => setShowProjectSelector(true)}
                    variant="secondary"
                    size="lg"
                  >
                    <FolderOpen size={18} className="mr-2" />
                    Open Existing Project
                  </Button>
                )}
              </div>
            </div>
          ) : !design && !isGenerating ? (
            <div className="h-full flex flex-col items-center justify-start pt-8 overflow-y-auto">
              {/* Template Selector */}
              <TemplateSelector
                templates={templates as Template[]}
                onSelect={(template) => handleGenerateDesign(template.requirements)}
                isLoading={isGenerating}
              />
              {error && (
                <div className="mt-4 p-3 bg-[var(--error-muted)] border border-[var(--error)] rounded-[var(--radius-md)] text-[var(--error)] text-sm max-w-md">
                  {error}
                </div>
              )}
            </div>
          ) : design ? (
            <>
              {/* Overview View */}
              {activeView === 'overview' && (
                <div className="max-w-7xl mx-auto w-full">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">System Overview</h2>
                    <p className="text-[var(--text-secondary)]">High-level architecture and requirements.</p>
                  </div>
                  <OverviewTab design={design} />
                </div>
              )}

              {/* Diagrams View */}
              {isDiagramMode && (
                <div className="h-full flex flex-col">
                  {/* Diagram Tabs */}
                  <div className="flex items-center gap-1 mb-4 border-b border-[var(--border)] pb-2">
                    {diagramTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeView === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveView(tab.id as ViewType)}
                          className={`diagram-tab flex items-center gap-1.5 ${isActive ? 'active' : ''}`}
                        >
                          <Icon size={14} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex-1 overflow-hidden shadow-sm">
                    {design.diagrams?.[activeView as keyof typeof design.diagrams] ? (
                      <InteractiveDiagram
                        data={design.diagrams[activeView as keyof typeof design.diagrams] as any}
                        title={diagramTabs.find(t => t.id === activeView)?.label}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[var(--text-tertiary)]">
                        No diagram data available
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Components View */}
              {activeView === 'components' && (
                <div className="max-w-7xl mx-auto w-full">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Components</h2>
                    <p className="text-[var(--text-secondary)]">System components and their responsibilities.</p>
                  </div>
                  <ComponentsTab components={design.components} />
                </div>
              )}

              {/* Data Model View */}
              {activeView === 'dataModel' && (
                <div className="max-w-7xl mx-auto w-full">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Data Model</h2>
                    <p className="text-[var(--text-secondary)]">Database schema, entities, and relationships.</p>
                  </div>
                  <DataModelTab dataModel={design.dataModel} />
                </div>
              )}

              {/* API View */}
              {activeView === 'api' && (
                <div className="max-w-7xl mx-auto w-full">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">API Specification</h2>
                    <p className="text-[var(--text-secondary)]">Endpoints, methods, and descriptions.</p>
                  </div>
                  <ApiTab api={design.api} />
                </div>
              )}

              {/* Code View */}
              {activeView === 'code' && selectedProject && currentVersion && (
                <div className="h-full flex flex-col">
                  <CodeHub projectId={selectedProject.id} versionId={currentVersion.id} />
                </div>
              )}

              {/* Documentation View */}
              {activeView === 'docs' && (
                <DocumentationTab design={design} projectName={selectedProject?.name} />
              )}

              {/* Versions/Placeholders */}
              {['versions'].includes(activeView) && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <GitBranch size={48} className="text-[var(--text-tertiary)] mb-4" />
                  <h3 className="text-lg font-semibold text-[var(--text-secondary)]">Versions</h3>
                  <p className="text-[var(--text-muted)]">Version history coming soon.</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">Current Version: v{currentVersion?.versionNumber}</p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Global Toast/Error */}
        {error && design && (
          <div className="absolute bottom-4 right-4 p-4 bg-[var(--error-muted)] border border-[var(--error)] rounded-[var(--radius-md)] text-[var(--error)] text-sm shadow-lg max-w-sm animate-in slide-in-from-bottom-5">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Chat Input - Always Visible */}
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

      {/* Project Selector Modal */}
      <Modal
        isOpen={showProjectSelector}
        onClose={() => setShowProjectSelector(false)}
        title="Select Project"
        size="lg"
      >
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
