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
    <div style={{padding:40}}>
      <h1>Email Job App</h1>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      
      <button onClick={submitEmail} disabled={loading}>Submit</button>
      {status && (
        <p>
          status:<strong> {status} </strong>
        </p>
        )}
    </div>
  )
}

export default App
