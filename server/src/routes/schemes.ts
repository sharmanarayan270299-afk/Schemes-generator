import { Router } from "express";
import { schemes } from "../data/schemes.js";
import type { SchemeCategory, SchemeStatus } from "../types.js";

const router = Router();

router.get("/schemes", (req, res) => {
  const { category, status, level, search } = req.query;
  let results = schemes;

  if (typeof category === "string" && category.trim() !== "") {
    results = results.filter((s) => s.category === (category as SchemeCategory));
  }
  if (typeof status === "string" && status.trim() !== "") {
    results = results.filter((s) => s.status === (status as SchemeStatus));
  }
  if (typeof level === "string" && level.trim() !== "") {
    results = results.filter((s) => s.level === level);
  }
  if (typeof search === "string" && search.trim() !== "") {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json({ count: results.length, schemes: results });
});

router.get("/schemes/:id", (req, res) => {
  const scheme = schemes.find((s) => s.id === req.params.id);
  if (!scheme) {
    return res.status(404).json({ error: "Scheme not found" });
  }
  res.json(scheme);
});

router.get("/categories", (_req, res) => {
  const counts = new Map<string, number>();
  for (const s of schemes) {
    counts.set(s.category, (counts.get(s.category) ?? 0) + 1);
  }
  res.json(
    Array.from(counts.entries()).map(([category, count]) => ({ category, count }))
  );
});

router.get("/stats", (_req, res) => {
  const total = schemes.length;
  const active = schemes.filter((s) => s.status === "Active").length;
  const upcoming = schemes.filter((s) => s.status === "Upcoming").length;
  const closed = schemes.filter((s) => s.status === "Closed").length;
  const categories = new Set(schemes.map((s) => s.category)).size;

  res.json({ total, active, upcoming, closed, categories });
});

export default router;
