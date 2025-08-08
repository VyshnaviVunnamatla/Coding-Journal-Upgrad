import express from "express";
import Problem from "../models/Problem.js";
const router = express.Router();

// GET /api/analytics/problem/:id
router.get("/problem/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const submissions = problem.submissions || [];
    const total = submissions.length;
    const passed = submissions.filter(s => s.result === "passed").length;
    const avgTime = submissions.length ? (submissions.reduce((a,b)=>a+(b.timeMs||0),0)/submissions.length) : 0;
    // top error types
    const errorCounts = {};
    submissions.forEach(s => {
      if (s.errorType) errorCounts[s.errorType] = (errorCounts[s.errorType]||0)+1;
    });
    const topErrors = Object.entries(errorCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(e=>({error:e[0],count:e[1]}));

    res.json({
      totalSubmissions: total,
      passed,
      successRate: total? Math.round((passed/total)*100):0,
      avgTimeMs: Math.round(avgTime),
      topErrors
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
