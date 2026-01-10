const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Project {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    versions?: ProjectVersion[];
}

export interface ProjectVersion {
    id: string;
    projectId: string;
    versionNumber: number;
    requirementsText: string;
    designJson?: Design | null;
    createdAt: string;
}

export interface Design {
    requirements: {
        actors: string[];
        functional: string[];
        nfr: string[];
        assumptions: string[];
    };
    architecture: {
        pattern: string;
        rationale: string[];
        risks: string[];
    };
    components: Array<{
        name: string;
        responsibilities: string[];
    }>;
    dataModel: Array<{
        entity: string;
        fields: Array<{ name: string; type: string }>;
    }>;
    api: Array<{
        method: string;
        path: string;
        purpose: string;
    }>;
    diagrams: {
        c4Context: { nodes: any[]; edges: any[] };
        c4Container: { nodes: any[]; edges: any[] };
        erd: { nodes: any[]; edges: any[] };
        sequence: { nodes: any[]; edges: any[] };
    };
}

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE;
    }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Projects
    async getProjects(): Promise<Project[]> {
        return this.request<Project[]>('/projects');
    }

    async getProject(projectId: string): Promise<Project> {
        return this.request<Project>(`/projects/${projectId}`);
    }

    async createProject(data: { name: string; description?: string }): Promise<Project> {
        return this.request<Project>('/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Versions
    async getVersions(projectId: string): Promise<ProjectVersion[]> {
        return this.request<ProjectVersion[]>(`/projects/${projectId}/versions`);
    }

    async createVersion(projectId: string, requirementsText: string): Promise<ProjectVersion> {
        return this.request<ProjectVersion>(`/projects/${projectId}/versions`, {
            method: 'POST',
            body: JSON.stringify({ requirementsText }),
        });
    }

    async generateDesign(
        projectId: string,
        versionId: string,
        constraints?: Record<string, unknown>
    ): Promise<ProjectVersion> {
        return this.request<ProjectVersion>(
            `/projects/${projectId}/versions/${versionId}/generate`,
            {
                method: 'POST',
                body: JSON.stringify({ constraints }),
            }
        );
    }

    async getDesign(projectId: string, versionId: string): Promise<{
        versionId: string;
        versionNumber: number;
        createdAt: string;
        design: Design;
    }> {
        return this.request(`/projects/${projectId}/versions/${versionId}/design`);
    }

    async getDiagrams(projectId: string, versionId: string): Promise<{
        versionId: string;
        versionNumber: number;
        diagrams: Design['diagrams'];
    }> {
        return this.request(`/projects/${projectId}/versions/${versionId}/diagrams`);
    }

    // Templates
    async getTemplates(): Promise<ArchitectureTemplate[]> {
        return this.request<ArchitectureTemplate[]>('/templates');
    }

    async getTemplate(templateId: string): Promise<ArchitectureTemplate> {
        return this.request<ArchitectureTemplate>(`/templates/${templateId}`);
    }

    // Refinement
    async refineDesign(
        projectId: string,
        versionId: string,
        refinementRequest: string,
        constraints?: Record<string, unknown>
    ): Promise<ProjectVersion> {
        return this.request<ProjectVersion>(
            `/projects/${projectId}/versions/${versionId}/refine`,
            {
                method: 'POST',
                body: JSON.stringify({ refinementRequest, constraints }),
            }
        );
    }
}

export interface ArchitectureTemplate {
    id: string;
    name: string;
    icon: string;
    category: 'web' | 'mobile' | 'enterprise' | 'realtime';
    description: string;
    techStack: string[];
    requirements: string;
    constraints: Record<string, unknown>;
}

export const api = new ApiClient();
