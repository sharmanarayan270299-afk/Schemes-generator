import { Router } from "express";
import { getLiveUpdates, sources } from "../scrapers/index.js";

const router = Router();

router.get("/live-updates", async (req, res) => {
  const forceRefresh = req.query.refresh === "true";
  const { updates, errors, fetchedAt } = await getLiveUpdates({ forceRefresh });
  res.json({ count: updates.length, updates, errors, fetchedAt });
});

router.get("/live-updates/sources", (_req, res) => {
  res.json(
    sources.map((s) => ({
      id: s.id,
      name: s.name,
      url: s.url,
      jurisdiction: s.jurisdiction,
      checkFrequency: s.checkFrequency,
    }))
  );
});

export default router;
