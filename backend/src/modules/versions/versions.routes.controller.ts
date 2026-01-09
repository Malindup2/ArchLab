import { prisma } from "../../db/prisma";
import { Prisma } from "@prisma/client";
import { asyncHandler } from "../../common/asyncHandler";
import { HttpError } from "../../common/httpError";
import { z } from "zod";
import { runDesignPipeline } from "../ai/orchestrator";

const CreateVersionSchema = z.object({
  requirementsText: z.string().min(10),
});

export const createVersion = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new HttpError(400, "Project ID is required");
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new HttpError(404, "Project not found");

  const parsed = CreateVersionSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid body", parsed.error.flatten());

  const last = await prisma.projectVersion.findFirst({
    where: { projectId },
    orderBy: { versionNumber: "desc" },
    select: { versionNumber: true },
  });

  const versionNumber = (last?.versionNumber ?? 0) + 1;

  const version = await prisma.projectVersion.create({
    data: {
      projectId,
      versionNumber,
      requirementsText: parsed.data.requirementsText,
      designJson: Prisma.JsonNull,
    },
  });

  res.status(201).json(version);
});

export const listVersions = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const versions = await prisma.projectVersion.findMany({
    where: { projectId },
    orderBy: { versionNumber: "desc" },
  });

  res.json(versions);
});

export const getVersion = asyncHandler(async (req, res) => {
  const { projectId, versionId } = req.params;

  const version = await prisma.projectVersion.findFirst({
    where: { id: versionId, projectId },
  });

  if (!version) throw new HttpError(404, "Version not found");
  res.json(version);
});

const GenerateSchema = z.object({
  constraints: z
    .object({
      budget: z.string().optional(),
      teamSize: z.number().int().positive().optional(),
      cloud: z.string().optional(),
    })
    .optional(),
});

export const generateDesign = asyncHandler(async (req, res) => {
  const { projectId, versionId } = req.params;

  const version = await prisma.projectVersion.findFirst({
    where: { id: versionId, projectId },
  });
  if (!version) throw new HttpError(404, "Version not found");

  const parsed = GenerateSchema.safeParse(req.body ?? {});
  if (!parsed.success) throw new HttpError(400, "Invalid body", parsed.error.flatten());

  const design = await runDesignPipeline({
    requirementsText: version.requirementsText,
    constraints: parsed.data.constraints ?? {},
  });

  const updated = await prisma.projectVersion.update({
    where: { id: version.id },
    data: { designJson: design },
  });

  res.json(updated);
});

/**
 * GET /projects/:projectId/versions/:versionId/design
 * Returns the full structured design JSON
 */
export const getDesign = asyncHandler(async (req, res) => {
  const { projectId, versionId } = req.params;

  const version = await prisma.projectVersion.findFirst({
    where: { id: versionId, projectId },
    select: {
      id: true,
      versionNumber: true,
      designJson: true,
      createdAt: true,
    },
  });

  if (!version) throw new HttpError(404, "Version not found");
  if (!version.designJson) throw new HttpError(404, "Design not generated yet");

  res.json({
    versionId: version.id,
    versionNumber: version.versionNumber,
    createdAt: version.createdAt,
    design: version.designJson,
  });
});

/**
 * GET /projects/:projectId/versions/:versionId/diagrams
 * Returns only the Mermaid diagram strings
 */
export const getDiagrams = asyncHandler(async (req, res) => {
  const { projectId, versionId } = req.params;

  const version = await prisma.projectVersion.findFirst({
    where: { id: versionId, projectId },
    select: {
      id: true,
      versionNumber: true,
      designJson: true,
    },
  });

  if (!version) throw new HttpError(404, "Version not found");
  if (!version.designJson) throw new HttpError(404, "Design not generated yet");

  const design = version.designJson as {
    diagrams?: {
      c4Context?: string;
      c4Container?: string;
      erd?: string;
      sequence?: string;
    };
  };

  res.json({
    versionId: version.id,
    versionNumber: version.versionNumber,
    diagrams: design.diagrams ?? {},
  });
});

