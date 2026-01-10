import { z } from "zod";

export const DesignSchema = z.object({
  requirements: z.object({
    actors: z.array(z.string()),
    functional: z.array(z.string()),
    nfr: z.array(z.string()),
    assumptions: z.array(z.string()),
  }),
  architecture: z.object({
    pattern: z.string(),
    rationale: z.array(z.string()),
    risks: z.array(z.string()),
  }),
  techStack: z.object({
    frontend: z.enum(['Next.js', 'React', 'Vue', 'Angular', 'None']),
    backend: z.enum(['Node.js', 'Python', 'Go', 'Java', 'None']),
    database: z.enum(['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'None']),
    infrastructure: z.array(z.string()),
  }),
  components: z.array(z.object({ name: z.string(), responsibilities: z.array(z.string()) })),
  dataModel: z.array(z.object({ entity: z.string(), fields: z.array(z.object({ name: z.string(), type: z.string() })) })),
  api: z.array(z.object({ method: z.string(), path: z.string(), purpose: z.string() })),
  diagrams: z.object({
    c4Context: z.object({ nodes: z.array(z.any()), edges: z.array(z.any()) }),
    c4Container: z.object({ nodes: z.array(z.any()), edges: z.array(z.any()) }),
    erd: z.object({ nodes: z.array(z.any()), edges: z.array(z.any()) }),
    sequence: z.object({ nodes: z.array(z.any()), edges: z.array(z.any()) }),
  }),
});
export type Design = z.infer<typeof DesignSchema>;
