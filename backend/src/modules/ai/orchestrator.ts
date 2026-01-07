import { geminiModel } from "./gemini-client";
import { DesignSchema, type Design } from "./schemas";

export async function runDesignPipeline(input: {
  requirementsText: string;
  constraints: Record<string, any>;
}): Promise<Design> {
  const prompt = `
You are a senior software architect.

TASK:
Generate a SYSTEM DESIGN for the following requirements.

RULES (VERY IMPORTANT):
- Output ONLY valid JSON
- Do NOT include markdown
- Do NOT include explanations outside JSON
- Follow the exact JSON schema

REQUIREMENTS:
${input.requirementsText}

CONSTRAINTS:
${JSON.stringify(input.constraints)}

JSON SCHEMA:
{
  "requirements": {
    "actors": string[],
    "functional": string[],
    "nfr": string[],
    "assumptions": string[]
  },
  "architecture": {
    "pattern": string,
    "rationale": string[],
    "risks": string[]
  },
  "components": {
    "name": string,
    "responsibilities": string[]
  }[],
  "dataModel": {
    "entity": string,
    "fields": { "name": string, "type": string }[]
  }[],
  "api": {
    "method": string,
    "path": string,
    "purpose": string
  }[],
  "diagrams": {
    "c4Context": string,
    "c4Container": string,
    "erd": string,
    "sequence": string
  }
}
`;

  const result = await geminiModel.generateContent(prompt);
  const text = result.response.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error("Gemini returned invalid JSON");
  }


  return DesignSchema.parse(parsed);
}
