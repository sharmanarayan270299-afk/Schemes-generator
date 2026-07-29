import cors from "cors";
import express from "express";
import schemesRouter from "./routes/schemes.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", schemesRouter);

app.listen(PORT, () => {
  console.log(`Schemes API listening on http://localhost:${PORT}`);
});
