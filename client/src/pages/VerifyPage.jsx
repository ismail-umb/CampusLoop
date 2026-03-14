import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = location.state?.email || "";

  const [email, setEmail] = useState(prefilledEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleVerify(e) {
    e.preventDefault();
    try {
      setError("");
      await api.post("/auth/verify", { email, code });
      setMessage("Email verified successfully. You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    }
  }

  async function resendCode() {
    try {
      setError("");
      await api.post("/auth/resend-code", { email });
      setMessage("Verification code resent.");
    } catch (err) {
      setError(err.response?.data?.error || "Could not resend code");
    }
  }

  return (
    <main className="page">
      <div className="container narrow">
        <div className="card">
          <h2>Verify your UMass Boston email</h2>
          <form onSubmit={handleVerify} className="form">
            <input
              type="email"
              placeholder="yourname@umb.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <button className="btn" type="submit">Verify</button>
          </form>

          <button className="btn btn-outline" onClick={resendCode}>
            Resend Code
          </button>
        </div>
      </div>
    </main>
  );
}