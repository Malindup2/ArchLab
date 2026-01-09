import { geminiModel } from "./gemini-client";
import { DesignSchema, type Design } from "./schemas";

/**
 * Extracts JSON from a string that might contain markdown code blocks or extra text
 */
function extractJson(text: string): string {
  // Remove markdown code blocks if present
  let cleaned = text.trim();


  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    cleaned = codeBlockMatch[1].trim();
  }


  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

export async function runDesignPipeline(input: {
  requirementsText: string;
  constraints: Record<string, any>;
}): Promise<Design> {
  const prompt = `You are a senior software architect. Generate a SYSTEM DESIGN as JSON.

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no explanations, no code blocks
2. Do NOT wrap response in \`\`\` or \`\`\`json
3. Start your response with { and end with }
4. If you cannot generate a complete design, return: {}

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
    "rationale": ["reasons for choosing this pattern"],
    "risks": ["potential risks and mitigation strategies"]
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
    "c4Context": "Mermaid diagram code for C4 Context",
    "c4Container": "Mermaid diagram code for C4 Container",
    "erd": "Mermaid diagram code for ERD",
    "sequence": "Mermaid diagram code for sequence diagram"
  }
}

NOW GENERATE THE JSON:`;

  const result = await geminiModel.generateContent(prompt);
  const rawText = result.response.text();

  // Clean and extract JSON
  const cleanedText = extractJson(rawText);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanedText);
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
