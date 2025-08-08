import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("All");
  const [topics, setTopics] = useState(["All"]);

  useEffect(() => {
    fetchTopics();
    fetchProblems();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [q, topic]);

  const fetchTopics = async () => {
    try {
      const res = await axios.get("/api/problems/topics/list");
      setTopics(res.data || ["All"]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProblems = async () => {
    try {
      const res = await axios.get("/api/problems", { params: { q, topic } });
      setProblems(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="sidebar">
      <div className="search-bar">
        <input placeholder="Search problems" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>

      <div className="topic-filter">
        <label>Topic</label>
        <select value={topic} onChange={(e)=>setTopic(e.target.value)}>
          {topics.map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="problem-list">
        <Link to="/new"><button>New Problem</button></Link>
        {problems.map(p=> (
          <div key={p._id} className="problem-item">
            <Link to={`/problem/${p._id}`}>
              <h4>{p.title}</h4>
              <small>{p.topic} • {p.difficulty}</small>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
