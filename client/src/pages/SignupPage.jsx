import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setMessage("");
      await api.post("/auth/signup", form);
      setMessage("Account created. Check your @umb.edu inbox for the verification code.");
      navigate("/verify", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  }

  return (
    <main className="page">
      <div className="container narrow">
        <div className="card">
          <h2>Create your CampusLoop account</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="grid two">
              <input
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
              <input
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>

            <input
              type="email"
              placeholder="yourname@umb.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <button className="btn" type="submit">Sign Up</button>
          </form>

          <p className="muted">
            Already registered? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}