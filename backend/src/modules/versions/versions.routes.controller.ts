import { prisma } from "../../db/prisma";
import { asyncHandler } from "../../common/asyncHandler";
import { HttpError } from "../../common/httpError";
import { z } from "zod";
import { runDesignPipeline } from "../ai/orchestrator";

const CreateVersionSchema = z.object({
  requirementsText: z.string().min(10),
});

export const createVersion = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

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
      designJson: null,
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
