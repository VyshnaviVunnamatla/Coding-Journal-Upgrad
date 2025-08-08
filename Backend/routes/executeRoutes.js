import express from "express";
import fetch from "node-fetch";
const router = express.Router();

// POST /api/execute/run
router.post("/run", async (req, res) => {
  try {
    const executorUrl = process.env.EXECUTOR_URL || "http://localhost:4001";
    const resp = await fetch(`${executorUrl}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error("Executor proxy error", err);
    res.status(500).json({ message: "Executor error", error: err.message });
  }
});

export default router;
