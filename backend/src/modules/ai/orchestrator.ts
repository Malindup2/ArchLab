import { geminiModel } from "./gemini-client";
import { DesignSchema, type Design } from "./schemas";

/**
 * Extracts JSON from a string that might contain markdown code blocks or extra text
 */
function extractJson(text: string): string {
  // 1. Remove markdown code blocks if they wrap the entire content
  // We match generic ``` blocks, but we only unwrap if it looks like the whole thing is wrapped
  const codeBlockMatch = text.match(/^\s*```(?:json)?\s*([\s\S]*?)```\s*$/);
  let cleaned = codeBlockMatch && codeBlockMatch[1] ? codeBlockMatch[1] : text;

  // 2. Find the first '{' and the last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Fallback: return original text (will likely fail parsing, but we tried)
  return cleaned;
}

export async function runDesignPipeline(input: {
  requirementsText: string;
  constraints: Record<string, any>;
}): Promise<Design> {
  const prompt = `You are a senior software architect. Generate a SYSTEM DESIGN as JSON.

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no explanations.
2. Arrays of strings (like 'risks') must contain simple STRINGS, not objects.
3. FOR DIAGRAMS (React Flow Structure):
   - Return "nodes" and "edges" arrays for each diagram.
   - Nodes must have: { id: "string", type: "default" | "table", label: "string", details?: string[] }
   - Edges must have: { id: "string", source: "nodeId", target: "nodeId", label?: "string" }
   - For ERD and Class diagrams, use type: "table" and provide field list in "details".

REQUIREMENTS:
${input.requirementsText}

CONSTRAINTS:
${JSON.stringify(input.constraints)}

REQUIRED JSON STRUCTURE (follow exactly):
{
  "requirements": {
    "actors": ["string array of system actors/users"],
    "functional": ["string array of functional requirements"],
    "nfr": ["string array of non-functional requirements"],
    "assumptions": ["string array of assumptions made"]
  },
  "architecture": {
    "pattern": "architecture pattern name (e.g., Microservices, Monolith, Event-Driven)",
    "rationale": ["string array explaining reasons"],
    "risks": ["string array describing risks and mitigation strategies"]
  },
  "techStack": {
    "frontend": "Next.js | React | Vue | Angular | None",
    "backend": "Node.js | Python | Go | Java | None",
    "database": "PostgreSQL | MongoDB | MySQL | Redis | None",
    "infrastructure": ["string array e.g. Docker, Kubernetes"]
  },
  "components": [
    { "name": "ComponentName", "responsibilities": ["what this component does"] }
  ],
  "dataModel": [
    { "entity": "EntityName", "fields": [{ "name": "fieldName", "type": "fieldType" }] }
  ],
  "api": [
    { "method": "GET/POST/PUT/DELETE", "path": "/api/resource", "purpose": "what this endpoint does" }
  ],
  "diagrams": {
    "c4Context": { "nodes": [], "edges": [] },
    "c4Container": { "nodes": [], "edges": [] },
    "erd": { "nodes": [], "edges": [] },
    "sequence": { "nodes": [], "edges": [] }
  }
}

NOW GENERATE THE JSON:`;

  const result = await geminiModel.generateContent(prompt);
  const rawText = result.response.text();

  // Clean and extract JSON
  const cleanedText = extractJson(rawText);

  let parsed: any;
  try {
    parsed = JSON.parse(cleanedText);

    // HELPER: Auto-fix array of objects -> array of strings for strict schema fields
    const stringifyItems = (items: any[]) => {
      if (!Array.isArray(items)) return items;
      return items.map(item => (typeof item === 'object' ? JSON.stringify(item) : String(item)));
    };

    if (parsed.architecture) {
      if (parsed.architecture.risks) {
        parsed.architecture.risks = stringifyItems(parsed.architecture.risks);
      }
      if (parsed.architecture.rationale) {
        parsed.architecture.rationale = stringifyItems(parsed.architecture.rationale);
      }
    }

    // HELPER: Normalize techStack if AI returns array instead of object
    if (Array.isArray(parsed.techStack)) {
      parsed.techStack = {
        frontend: 'None',
        backend: 'None',
        database: 'None',
        infrastructure: parsed.techStack.filter((t: string) => typeof t === 'string')
      };
    } else if (!parsed.techStack || typeof parsed.techStack !== 'object') {
      parsed.techStack = {
        frontend: 'None',
        backend: 'None',
        database: 'None',
        infrastructure: []
      };
    }
    // Note: Mermaid strip helper removed as we now expect JSON objects for diagrams
  } catch (err) {
    console.error("Raw Gemini response:", rawText);
    console.error("Cleaned text:", cleanedText);
    throw new Error(`Gemini returned invalid JSON: ${(err as Error).message}`);
  }

  // Validate with Zod schema
  const validated = DesignSchema.safeParse(parsed);
  if (!validated.success) {
    console.error("Zod validation failed:", validated.error.flatten());
    throw new Error(`Design validation failed: ${validated.error.message}`);
  }

  return validated.data;
}

/**
 * Refines an existing design based on a user's request.
 * Preserves existing structure while applying targeted changes.
 */
export async function runRefinementPipeline(input: {
  existingDesign: Design;
  refinementRequest: string;
  constraints?: Record<string, any>;
}): Promise<Design> {
  const prompt = `You are a senior software architect. You have an EXISTING system design that needs to be REFINED.

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no explanations.
2. PRESERVE all parts of the existing design that are NOT affected by the refinement request.
3. APPLY the user's requested changes intelligently - update relevant components, data models, APIs, and diagrams.
4. Keep the same JSON structure as the input design.
5. FOR DIAGRAMS (React Flow Structure):
   - Return "nodes" and "edges" arrays for each diagram.
   - Nodes must have: { id: "string", type: "default" | "table", label: "string", details?: string[] }
   - Edges must have: { id: "string", source: "nodeId", target: "nodeId", label?: "string" }

EXISTING DESIGN:
${JSON.stringify(input.existingDesign, null, 2)}

USER REFINEMENT REQUEST:
"${input.refinementRequest}"

${input.constraints ? `ADDITIONAL CONSTRAINTS:\n${JSON.stringify(input.constraints)}` : ''}

INSTRUCTIONS:
1. Carefully analyze what the user wants to change
2. Apply the changes to the relevant sections (architecture, components, dataModel, api, diagrams)
3. Update diagrams to reflect any architectural changes
4. Add new components/entities/endpoints as needed
5. Ensure 'techStack' is present and consistent with the design
6. Keep all unaffected parts exactly as they are
7. Return the COMPLETE updated design

NOW RETURN THE UPDATED JSON:`;

  const result = await geminiModel.generateContent(prompt);
  const rawText = result.response.text();

  // Clean and extract JSON
  const cleanedText = extractJson(rawText);

  let parsed: any;
  try {
    parsed = JSON.parse(cleanedText);

    // HELPER: Auto-fix array of objects -> array of strings for strict schema fields
    const stringifyItems = (items: any[]) => {
      if (!Array.isArray(items)) return items;
      return items.map(item => (typeof item === 'object' ? JSON.stringify(item) : String(item)));
    };

    if (parsed.architecture) {
      if (parsed.architecture.risks) {
        parsed.architecture.risks = stringifyItems(parsed.architecture.risks);
      }
      if (parsed.architecture.rationale) {
        parsed.architecture.rationale = stringifyItems(parsed.architecture.rationale);
      }
    }

    // HELPER: Normalize techStack if AI returns array instead of object
    if (Array.isArray(parsed.techStack)) {
      // Convert array like ["Next.js", "Node.js"] to default object
      parsed.techStack = {
        frontend: 'None',
        backend: 'None',
        database: 'None',
        infrastructure: parsed.techStack.filter((t: string) => typeof t === 'string')
      };
    } else if (!parsed.techStack || typeof parsed.techStack !== 'object') {
      // Provide default if missing
      parsed.techStack = {
        frontend: 'None',
        backend: 'None',
        database: 'None',
        infrastructure: []
      };
    }
  } catch (err) {
    console.error("Raw Gemini response:", rawText);
    console.error("Cleaned text:", cleanedText);
    throw new Error(`Gemini returned invalid JSON during refinement: ${(err as Error).message}`);
  }

  // Validate with Zod schema
  const validated = DesignSchema.safeParse(parsed);
  if (!validated.success) {
    console.error("Zod validation failed:", validated.error.flatten());
    throw new Error(`Refinement validation failed: ${validated.error.message}`);
  }

  return validated.data;
}

