import express from "express";
import Problem from "../models/Problem.js";
import fetch from "node-fetch";

const router = express.Router();


// Helper: call AI reviewer or fallback heuristic - improved prompt with JSON output request
async function generateReview(code, language, stdout, stderr) {
  const apiKey = process.env.OPENAI_API_KEY || "";
  const prompt = `You are a concise code reviewer. Given the code, stdout, and stderr, produce a JSON object with keys: "summary" (one-sentence), "probable_causes" (list of short causes), "suggested_fix" (one concise suggestion), and "readability" (integer 0-10). Respond ONLY with valid JSON.\n\nCode:\n${code}\n\nStdout:\n${stdout}\n\nStderr:\n${stderr}`;
  if (apiKey) {
    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
        })
      });
      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content || "";
      // Try to parse JSON from response
      try {
        const parsed = JSON.parse(text.trim());
        // Build a compact review string
        const review = `Summary: ${parsed.summary || ""}\nProbable causes: ${ (parsed.probable_causes || []).join("; ") }\nSuggested fix: ${parsed.suggested_fix || ""}\nReadability: ${parsed.readability || "N/A"}`;
        return review;
      } catch (e) {
        // fallback to raw text
        return text;
      }
    } catch (err) {
      console.error("OpenAI error", err);
      // fallback heuristic below
    }
  }
  // Fallback simple heuristic
  let review = "";
  if (stderr && stderr.length>0) {
    review += `Error detected: ${stderr.split("\n")[0]}. `;
    if (stderr.toLowerCase().includes("timeout")) review += "Likely infinite loop or heavy computation. ";
    if (stderr.toLowerCase().includes("memory")) review += "Memory limit exceeded; consider optimizing data structures. ";
  } else if (stdout && stdout.length>0) {
    review += "Code ran successfully. ";
  } else {
    review += "No output; check input handling or main function. ";
  }
  review += "\nSuggested fix: Review edge cases and add input validation.\nReadability score: 6/10";
  return review;
}


// POST /api/problems/:id/submit
router.post("/:id/submit", async (req, res) => {
  try {
    const { language, code, stdout, stderr, timeMs, exitCode } = req.body;
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const reviewText = await generateReview(code, language, stdout, stderr);
    const result = stderr && stderr.length>0 ? (stderr.toLowerCase().includes("timeout") ? "timeout" : "error") : "passed";

    const submission = {
      userId: null,
      code,
      language,
      stdout: stdout || "",
      stderr: stderr || "",
      exitCode: exitCode || 0,
      timeMs: timeMs || 0,
      result,
      errorType: stderr ? stderr.split("\\n")[0] : "",
      reviewed: true,
      review: reviewText,
      createdAt: new Date(),
    };

    problem.submissions = problem.submissions || [];
    problem.submissions.push(submission);
    await problem.save();

    res.json({ submission });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET submissions for a problem
router.get("/:id/submissions", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem.submissions || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
