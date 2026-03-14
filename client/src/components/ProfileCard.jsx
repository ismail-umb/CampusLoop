import { Link } from "react-router-dom";

export default function ProfileCard({ profile, onMessage }) {
  const fullName = `${profile.user.firstName} ${profile.user.lastName}`;

  return (
    <div className="card profile-card">
      <div className="profile-card-top">
        <div>
          <h3>{fullName}</h3>
          <p className="muted">{profile.user.email}</p>
        </div>
        {profile.matchScore !== null && (
          <span className="badge">{profile.matchScore}% match</span>
        )}
      </div>

      <p>{profile.bio || "No bio added yet."}</p>

      <div className="grid two">
        <div><strong>Budget:</strong> ${profile.budgetMin} - ${profile.budgetMax}</div>
        <div><strong>Cleanliness:</strong> {profile.cleanliness}</div>
        <div><strong>Sleep:</strong> {profile.sleepSchedule}</div>
        <div><strong>Study:</strong> {profile.studyHabits}</div>
        <div><strong>Lease:</strong> {profile.leaseDurationMonths} months</div>
        <div><strong>Pets:</strong> {profile.petsOkay ? "Okay" : "No"}</div>
      </div>

      <div className="actions">
        <button className="btn" onClick={() => onMessage(profile.user.id)}>
          Message
        </button>
        <Link to="/messages" className="btn btn-outline">Open Inbox</Link>
      </div>
    </div>
  );
}