import { Router } from "express";
import { createProject, listProjects, getProject } from "./projects.routes.controller";

const router = Router();

router.post("/", createProject);
router.get("/", listProjects);
router.get("/:projectId", getProject);

export default router;
