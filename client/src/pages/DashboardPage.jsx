import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <main className="page">
      <div className="container">
        <div className="card">
          <h2>Welcome, {user.firstName}</h2>
          <p className="lead">
            Build your profile, browse compatible roommates, and start conversations.
          </p>
        </div>

        <div className="grid three">
          <div className="card">
            <h3>My Profile</h3>
            <p>Set your budget, schedule, habits, and roommate preferences.</p>
            <Link to="/profile" className="btn">Edit Profile</Link>
          </div>
          <div className="card">
            <h3>Browse Matches</h3>
            <p>Discover students with compatible preferences and lease goals.</p>
            <Link to="/browse" className="btn">Browse</Link>
          </div>
          <div className="card">
            <h3>Messages</h3>
            <p>Continue conversations with potential roommates safely in-platform.</p>
            <Link to="/messages" className="btn">Open Messages</Link>
          </div>
        </div>
      </div>
    </main>
  );
}