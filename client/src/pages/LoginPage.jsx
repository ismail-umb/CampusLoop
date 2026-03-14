import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <main className="page">
      <div className="container narrow">
        <div className="card">
          <h2>Log in</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="email"
              placeholder="UMass Boston email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {error && <p className="error">{error}</p>}
            <button className="btn" type="submit">Log In</button>
          </form>
          <p className="muted">
            Need an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </main>
  );
}