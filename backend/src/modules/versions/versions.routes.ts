import { Router } from "express";
import { createVersion, listVersions, getVersion, generateDesign } from "./versions.routes.controller";

const router = Router();

router.post("/:projectId/versions", createVersion);
router.get("/:projectId/versions", listVersions);
router.get("/:projectId/versions/:versionId", getVersion);

router.post("/:projectId/versions/:versionId/generate", generateDesign);

export default router;
