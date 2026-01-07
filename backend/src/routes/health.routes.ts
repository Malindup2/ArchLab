import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ status: "ArchLab backend is running" });
});

export default router;
