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
  components: z.array(z.object({ name: z.string(), responsibilities: z.array(z.string()) })),
  dataModel: z.array(z.object({ entity: z.string(), fields: z.array(z.object({ name: z.string(), type: z.string() })) })),
  api: z.array(z.object({ method: z.string(), path: z.string(), purpose: z.string() })),
  diagrams: z.object({
    c4Context: z.string(),
    c4Container: z.string(),
    erd: z.string(),
    sequence: z.string(),
  }),
});
export type Design = z.infer<typeof DesignSchema>;
