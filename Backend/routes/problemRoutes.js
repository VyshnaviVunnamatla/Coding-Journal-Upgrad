import express from "express";
import Problem from "../models/Problem.js";
const router = express.Router();

// Create a problem
router.post("/", async (req, res) => {
  try {
    const { title, description, difficulty, topic, tags } = req.body;
    const newProblem = new Problem({
      title,
      description,
      difficulty: difficulty || "Easy",
      topic: topic || "General",
      tags: tags || [],
    });
    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all problems (supports query: search & topic)
router.get("/", async (req, res) => {
  try {
    const { q, topic } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: "i" };
    if (topic && topic !== "All") filter.topic = topic;
    const problems = await Problem.find(filter).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get distinct topics
router.get("/topics/list", async (req, res) => {
  try {
    const topics = await Problem.distinct("topic");
    res.json(["All", ...topics]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get one problem
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Not found" });
    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
