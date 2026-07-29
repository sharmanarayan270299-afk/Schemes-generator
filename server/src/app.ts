import cors from "cors";
import express from "express";
import liveUpdatesRouter from "./routes/liveUpdates.js";
import schemesRouter from "./routes/schemes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", schemesRouter);
app.use("/api", liveUpdatesRouter);

export default app;
