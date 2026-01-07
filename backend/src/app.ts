import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import healthRoutes from "./routes/health.routes";
app.use("/health", healthRoutes);

export default app;
