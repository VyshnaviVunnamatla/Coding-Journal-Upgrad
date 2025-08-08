import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Try to import Monaco editor; fallback handled dynamically
let MonacoEditor = null;
try {
  // eslint-disable-next-line
  MonacoEditor = require("@monaco-editor/react").default;
} catch (e) {
  MonacoEditor = null;
}

export default function ProblemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [topic, setTopic] = useState("General");
  const [topics, setTopics] = useState(["General"]);
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");
  const [submissionReview, setSubmissionReview] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    fetchTopics();
    if (id) {
      fetchProblem();
    }
  }, [id]);

  const fetchTopics = async () => {
    try {
      const res = await axios.get("/api/problems/topics/list");
      setTopics(res.data || ["General"]);
    } catch (err) {
      console.error("Could not fetch topics", err);
    }
  };

  const fetchProblem = async () => {
    try {
      const res = await axios.get(`/api/problems/${id}`);
      const p = res.data;
      setTitle(p.title);
      setDescription(p.description);
      setDifficulty(p.difficulty);
      setTopic(p.topic || "General");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/problems", { title, description, difficulty, topic });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRun = async () => {
    try {
      const res = await axios.post("/api/execute/run", { language, code });
      const execRes = res.data || {};
      // POST submission to backend to store and generate review
      const submitRes = await axios.post(`/api/problems/${id || 'temp'}/submit`, {
        language,
        code,
        stdout: execRes.stdout,
        stderr: execRes.stderr,
        timeMs: execRes.timeMs,
        exitCode: execRes.exitCode
      }).catch(e=>{
        // If problem id not present (running code from new problem page), use a temp submit endpoint could be implemented later
        return { data: { submission: { review: 'No problem id; review stored locally.' } } };
      });
      const review = submitRes.data?.submission?.review || 'No review';
      setSubmissionReview(review);
      alert(JSON.stringify(execRes, null, 2));
    } catch (err) {
      console.error(err);
      alert("Execution failed");
    }
  };

  return (
    <div className="problem-form">
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Problem title" required />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Problem description" />
        <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </select>

        <label>Topic</label>
        <select value={topic} onChange={(e)=>setTopic(e.target.value)}>
          {topics.map(t=> <option key={t} value={t}>{t}</option>)}
          <option value="__new">-- Add new topic --</option>
        </select>
        {topic==="__new" && (
          <input placeholder="New topic" onBlur={(e)=>setTopic(e.target.value || "General")} />
        )}

        <label>Language</label>
        <select value={language} onChange={(e)=>setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <div style={{height:400, border:"1px solid #ddd", marginTop:10}}>
          {MonacoEditor ? (
            <MonacoEditor
              height="100%"
              defaultLanguage={language}
              language={language}
              defaultValue={code}
              value={code}
              onChange={(val)=>setCode(val)}
              theme="vs-dark"
              onMount={(editor)=>editorRef.current = editor}
            />
          ) : (
            <textarea style={{width:"100%",height:"100%"}} value={code} onChange={(e)=>setCode(e.target.value)} />
          )}
        </div>

        <button type="button" onClick={handleRun}>Run Code</button>
        {submissionReview && (
          <div className="ai-review" style={{whiteSpace:'pre-wrap',marginTop:12,border:'1px solid #eee',padding:10}}>
            <strong>AI Review:</strong>
            <div>{submissionReview}</div>
          </div>
        )}
        <button type="submit">Save Problem</button>
      </form>
    </div>
  );
}
