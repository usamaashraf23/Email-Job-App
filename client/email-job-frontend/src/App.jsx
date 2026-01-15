import { useEffect } from 'react';
import { useState } from 'react'


function App() {
  const [email, setEmail] = useState("");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  
  const submitEmail = async () => {
    if (!email) {
      alert("Please enter an email");
      return;
    }

    setLoading(true);
    setStatus("Creating Job...");

    const res = await fetch("http://localhost:3000/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    setJobId(data.jobId);
  }

  useEffect(() => {
    if (!jobId) {
      return;
    }
    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:3000/jobs/${jobId}`);
      const data = await res.json();
      setStatus(data.status);
      if (data.status === "completed" || data.status === "failed") {
        clearInterval(interval);
        setLoading(false);
      }
    }, 2000);

    return ()=> clearInterval(interval);
  },[jobId]);
  return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f7fa"
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "10px",
        width: "350px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Email Job App</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "15px"
        }}
      />

      <button
        onClick={submitEmail}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          fontWeight: "bold",
          borderRadius: "6px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          background: loading ? "#aaa" : "#4f46e5",
          color: "#fff"
        }}
      >
        {loading ? "Processing..." : "Submit"}
      </button>

      {status && (
        <p
          style={{
            marginTop: "20px",
            padding: "10px",
            borderRadius: "6px",
            background:
              status === "completed"
                ? "#e6fffa"
                : status === "failed"
                ? "#ffe6e6"
                : "#eef2ff",
            color:
              status === "completed"
                ? "#065f46"
                : status === "failed"
                ? "#991b1b"
                : "#1e3a8a",
            fontWeight: "bold"
          }}
        >
          Status: {status}
        </p>
      )}
    </div>
  </div>
);
}

export default App
