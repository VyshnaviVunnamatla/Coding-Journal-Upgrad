import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import problemRoutes from "./routes/problemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://coding-journal-vv.vercel.app",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Coding Journal API is running.");
});

app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/problems", submissionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/problems", submissionRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
