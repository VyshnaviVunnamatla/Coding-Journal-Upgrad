import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [problemId, setProblemId] = useState("");
  const [message, setMessage] = useState("Enter a problem id to fetch analytics.");

  const fetchStats = async () => {
    if (!problemId) return setMessage("Please provide problem id.");
    try {
      const res = await axios.get(`/api/analytics/problem/${problemId}`);
      setStats(res.data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch analytics. Ensure backend is running and id is correct.");
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Problem Analytics</h2>
      <input placeholder="Problem ID" value={problemId} onChange={(e)=>setProblemId(e.target.value)} style={{width:300}}/>
      <button onClick={fetchStats}>Fetch</button>
      {message && <div style={{marginTop:10}}>{message}</div>}
      {stats && (
        <div style={{marginTop:20}}>
          <p>Total submissions: {stats.totalSubmissions}</p>
          <p>Success rate: {stats.successRate}% ({stats.passed}/{stats.totalSubmissions})</p>
          <p>Average runtime: {stats.avgTimeMs} ms</p>
          <h4>Top errors</h4>
          <ul>
            {stats.topErrors.map(e=> <li key={e.error}>{e.error} — {e.count}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}