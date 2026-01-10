import { Router } from "express";
import { createVersion, listVersions, getVersion, generateDesign, getDesign, getDiagrams, refineDesign, getCode, downloadCode } from "./versions.routes.controller";

const router = Router();

router.post("/:projectId/versions", createVersion);
router.get("/:projectId/versions", listVersions);
router.get("/:projectId/versions/:versionId", getVersion);

router.post("/:projectId/versions/:versionId/generate", generateDesign);
router.post("/:projectId/versions/:versionId/refine", refineDesign);
router.get("/:projectId/versions/:versionId/design", getDesign);
router.get("/:projectId/versions/:versionId/diagrams", getDiagrams);

router.get("/:projectId/versions/:versionId/code", getCode);
router.get("/:projectId/versions/:versionId/download", downloadCode);

export default router;

