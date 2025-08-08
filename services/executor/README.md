# Executor Service

This service runs user-submitted code inside Docker containers.

**Requirements:** Docker must be installed on the host.

**Run:**
```
cd services/executor
npm install
node server.js
```

It exposes `/run` which accepts `{ language, code }` and returns `{ stdout, stderr, timeMs, exitCode }`.


## Security & deployment notes
- The executor uses Docker to isolate executions. We set `--read-only`, `--pids-limit=64`, `--security-opt no-new-privileges`, and `--network none` to limit risk. However, achieving production-grade sandboxing requires additional kernel-level controls (seccomp, user namespaces) and custom minimal images.
- On managed platforms (like Render), you may need to provide a service with Docker access or use a separate VM that can run Docker. Render's native services may not allow Docker-in-Docker.

## Render Deployment (suggested)
- Backend: deploy Backend as a Node service on Render (use Dockerfile or Node build). Set environment variables: MONGO_URI, EXECUTOR_URL, OPENAI_API_KEY.
- Executor: deploy as a Docker service on a VM or a host that allows Docker. Alternatively, use Railway or a small cloud VM to host executor and set EXECUTOR_URL accordingly.
- Frontend: deploy to Vercel (React app). Use Vercel environment variables to point to backend URL.
