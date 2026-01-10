import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HttpError } from "./common/httpError";

import healthRoutes from "./modules/health/health.routes";
import projectsRoutes from "./modules/projects/projects.routes";
import versionsRoutes from "./modules/versions/versions.routes";
import templatesRoutes from "./modules/templates/templates.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/health", healthRoutes);
app.use("/projects", projectsRoutes);
app.use("/projects", versionsRoutes);
app.use("/templates", templatesRoutes);


app.use((req, res) => res.status(404).json({ message: "Not Found" }));


app.use((err: any, req: any, res: any, next: any) => {
  const status = err instanceof HttpError ? err.status : 500;
  res.status(status).json({
    message: err?.message || "Server Error",
    details: err instanceof HttpError ? err.details : undefined,
  });
});

export default app;
