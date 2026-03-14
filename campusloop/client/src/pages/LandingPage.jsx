import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">UMass Boston student housing support</p>
            <h1>Find a compatible roommate in the UMass Boston community.</h1>
            <p className="lead">
              CampusLoop helps verified students connect through shared lifestyle,
              budget, lease, and study preferences.
            </p>
            <div className="actions">
              <Link to="/signup" className="btn">Create Account</Link>
              <Link to="/login" className="btn btn-outline">Log In</Link>
            </div>
          </div>

          <div className="card hero-card">
            <h3>What you can do</h3>
            <ul className="feature-list">
              <li>Verify with your @umb.edu address</li>
              <li>Create a roommate profile</li>
              <li>Filter by budget, sleep, cleanliness, and lease length</li>
              <li>Message potential roommates directly</li>
              <li>Report unsafe or inappropriate behavior</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}