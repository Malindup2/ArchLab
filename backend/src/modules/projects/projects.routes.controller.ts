import { prisma } from "../../db/prisma";
import { asyncHandler } from "../../common/asyncHandler";
import { HttpError } from "../../common/httpError";
import { z } from "zod";

const CreateProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const createProject = asyncHandler(async (req, res) => {
  const parsed = CreateProjectSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid body", parsed.error.flatten());

  const project = await prisma.project.create({ data: parsed.data });
  res.status(201).json(project);
});

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { versions: { select: { id: true, versionNumber: true, createdAt: true } } },
  });
  res.json(projects);
});

export const getProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { versions: { orderBy: { versionNumber: "desc" } } },
  });
  if (!project) throw new HttpError(404, "Project not found");
  res.json(project);
});
