import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>CampusLoop</span>
          <span>UMass Boston Student Roommate Network</span>
        </div>
      </div>

      <div className="main-nav">
        <div className="container nav-inner">
          <Link to="/" className="brand">
            <div className="brand-mark">CL</div>
            <div>
              <div className="brand-title">CampusLoop</div>
              <div className="brand-subtitle">Verified @umb.edu only</div>
            </div>
          </Link>

          <nav className="nav-links">
            {user ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/browse">Browse</Link>
                <Link to="/profile">My Profile</Link>
                <Link to="/messages">Messages</Link>
                {user.role === "ADMIN" && <Link to="/admin">Admin</Link>}
                <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup" className="btn">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}