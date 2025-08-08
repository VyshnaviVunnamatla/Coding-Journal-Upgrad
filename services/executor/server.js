import express from "express";
import bodyParser from "body-parser";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import tmp from "tmp";

const app = express();
app.use(bodyParser.json({ limit: "1mb" }));

// Simple runner which executes code in Docker containers per language.
// NOTE: This requires Docker to be available on the host where this service runs.
// The images used should be lightweight (python:3.11-slim, openjdk:17-slim, gcc:11).
const languageConfig = {
  python: {
    image: "python:3.11-slim",
    file: "script.py",
    run: (filePath) => `python ${filePath}`
  },
  java: {
    image: "openjdk:17-slim",
    file: "Main.java",
    compile: (filePathDir) => `javac Main.java`,
    run: (filePathDir) => `java Main`
  },
  cpp: {
    image: "gcc:11",
    file: "main.cpp",
    compile: (filePathDir) => `g++ -O2 main.cpp -o main`,
    run: (filePathDir) => `./main`
  }
};

app.post("/run", async (req, res) => {
  const { language, code } = req.body;
  if (!language || !code) return res.status(400).json({ message: "language and code required" });

  const cfg = languageConfig[language];
  if (!cfg) return res.status(400).json({ message: "language not supported" });

  // create temp dir
  const tmpDir = tmp.dirSync({ unsafeCleanup: true });
  const workDir = tmpDir.name;

  try {
    const filePath = path.join(workDir, cfg.file);
    fs.writeFileSync(filePath, code, { encoding: "utf-8" });

    // prepare docker command with resource limits (2s CPU timeout via --rm --network none --memory)
    // We'll mount the tmp dir into container at /work
    const image = cfg.image;
    let cmd = "";

    if (cfg.compile) {
      // compile and run in a shell inside docker
      cmd = `docker run --rm -m=128m --pids-limit=64 --network none --security-opt no-new-privileges --read-only -v ${workDir}:/work -w /work ${image} bash -lc "mkdir -p /work && chmod -R 777 /work && ${cfg.compile(\'/work\')} && ${cfg.run(\'/work\')}"`;
    } else {
      cmd = `docker run --rm -m=128m --pids-limit=64 --network none --security-opt no-new-privileges --read-only -v ${workDir}:/work -w /work ${image} bash -lc "mkdir -p /work && chmod -R 777 /work && ${cfg.run(\'/work\')}"`;
    }

    // add timeout using timeout command in bash (may not be present in slim images) - use docker's --stop-timeout not reliable
    const start = Date.now();
    exec(cmd, { timeout: 4000, maxBuffer: 200 * 1024 }, (error, stdout, stderr) => {
      const timeMs = Date.now() - start;
      const result = {
        stdout: stdout || "",
        stderr: stderr || (error ? error.message : ""),
        timeMs,
        exitCode: error && error.code ? error.code : 0
      };
      res.json(result);
      try { tmpDir.removeCallback(); } catch(e){}
    });
  } catch (err) {
    try { tmpDir.removeCallback(); } catch(e){}
    console.error(err);
    res.status(500).json({ message: "Execution error", error: err.message });
  }
});

const port = process.env.PORT || 4001;
app.listen(port, ()=> console.log("Executor service listening on", port));
