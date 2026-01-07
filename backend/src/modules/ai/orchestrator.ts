import { DesignSchema, type Design } from "./schemas";

export async function runDesignPipeline(input: {
  requirementsText: string;
  constraints: Record<string, any>;
}): Promise<Design> {
  const draft: Design = {
    requirements: {
      actors: ["End User", "Admin"],
      functional: ["Create project", "Save versions", "Generate architecture pack"],
      nfr: ["Security", "Maintainability", "Cost awareness"],
      assumptions: ["MVP uses modular monolith", "PostgreSQL is primary database"],
    },
    architecture: {
      pattern: "Modular Monolith",
      rationale: ["Fast MVP delivery", "Clear boundaries", "Easy to scale later"],
      risks: ["Heavy export tasks may require background jobs later"],
    },
    components: [
      { name: "Projects", responsibilities: ["CRUD", "Versioning"] },
      { name: "AI Orchestrator", responsibilities: ["Call Gemini", "Validate JSON"] },
      { name: "Diagrams", responsibilities: ["Generate Mermaid text"] },
      { name: "Exports", responsibilities: ["Generate PDF/MD pack"] },
    ],
    dataModel: [
      { entity: "Project", fields: [{ name: "id", type: "string" }, { name: "name", type: "string" }] },
      { entity: "ProjectVersion", fields: [{ name: "id", type: "string" }, { name: "requirementsText", type: "text" }] },
    ],
    api: [
      { method: "POST", path: "/projects", purpose: "Create project" },
      { method: "POST", path: "/projects/:projectId/versions", purpose: "Create version" },
      { method: "POST", path: "/projects/:projectId/versions/:versionId/generate", purpose: "Generate design JSON" },
    ],
    diagrams: {
      c4Context: "placeholder",
      c4Container: "placeholder",
      erd: "placeholder",
      sequence: "placeholder",
    },
  };

  return DesignSchema.parse(draft);
}
