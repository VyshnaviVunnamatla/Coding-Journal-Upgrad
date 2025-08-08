import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  code: String,
  language: String,
  stdout: String,
  stderr: String,
  exitCode: Number,
  timeMs: Number,
  result: { type: String, enum: ["passed", "failed", "error", "timeout"], default: "failed" },
  errorType: String,
  reviewed: { type: Boolean, default: false },
  review: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  difficulty: { type: String, enum: ["Easy","Medium","Hard"], default: "Easy" },
  topic: { type: String, default: "General" },
  tags: [String],
  submissions: [submissionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
