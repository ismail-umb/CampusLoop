import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const defaultProfile = {
  bio: "",
  budgetMin: 800,
  budgetMax: 1400,
  lifestyle: "",
  cleanliness: "MEDIUM",
  sleepSchedule: "FLEXIBLE",
  studyHabits: "MODERATE",
  smokingAllowed: false,
  guestsOkay: false,
  petsOkay: false,
  leaseDurationMonths: 12,
  locationPreference: "",
  genderPreference: "",
  roommateCount: 1
};

export default function ProfilePage() {
  const { fetchMe } = useAuth();
  const [form, setForm] = useState(defaultProfile);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get("/profiles/me");
        if (res.data) {
          setForm({
            ...defaultProfile,
            ...res.data
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProfile();
  }, []);

  function update(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      await api.post("/profiles", {
        ...form,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        leaseDurationMonths: Number(form.leaseDurationMonths),
        roommateCount: Number(form.roommateCount)
      });
      await fetchMe();
      setMessage("Profile saved successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save profile");
    }
  }

  return (
    <main className="page">
      <div className="container">
        <div className="card">
          <h2>My Roommate Profile</h2>
          <form className="form" onSubmit={handleSubmit}>
            <textarea
              name="bio"
              rows="4"
              placeholder="Tell others about yourself..."
              value={form.bio}
              onChange={update}
            />

            <div className="grid two">
              <input name="budgetMin" type="number" value={form.budgetMin} onChange={update} placeholder="Min budget" />
              <input name="budgetMax" type="number" value={form.budgetMax} onChange={update} placeholder="Max budget" />
            </div>

            <input
              name="lifestyle"
              placeholder="Lifestyle habits"
              value={form.lifestyle}
              onChange={update}
            />

            <div className="grid three">
              <select name="cleanliness" value={form.cleanliness} onChange={update}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>

              <select name="sleepSchedule" value={form.sleepSchedule} onChange={update}>
                <option value="EARLY_BIRD">EARLY_BIRD</option>
                <option value="FLEXIBLE">FLEXIBLE</option>
                <option value="NIGHT_OWL">NIGHT_OWL</option>
              </select>

              <select name="studyHabits" value={form.studyHabits} onChange={update}>
                <option value="QUIET">QUIET</option>
                <option value="MODERATE">MODERATE</option>
                <option value="COLLABORATIVE">COLLABORATIVE</option>
              </select>
            </div>

            <div className="grid two">
              <input
                name="leaseDurationMonths"
                type="number"
                value={form.leaseDurationMonths}
                onChange={update}
                placeholder="Lease duration in months"
              />
              <input
                name="roommateCount"
                type="number"
                value={form.roommateCount}
                onChange={update}
                placeholder="Preferred roommate count"
              />
            </div>

            <input
              name="locationPreference"
              placeholder="Preferred area or neighborhood"
              value={form.locationPreference}
              onChange={update}
            />

            <input
              name="genderPreference"
              placeholder="Gender preference (optional)"
              value={form.genderPreference}
              onChange={update}
            />

            <label className="check">
              <input type="checkbox" name="smokingAllowed" checked={form.smokingAllowed} onChange={update} />
              Smoking allowed
            </label>

            <label className="check">
              <input type="checkbox" name="guestsOkay" checked={form.guestsOkay} onChange={update} />
              Guests okay
            </label>

            <label className="check">
              <input type="checkbox" name="petsOkay" checked={form.petsOkay} onChange={update} />
              Pets okay
            </label>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <button className="btn" type="submit">Save Profile</button>
          </form>
        </div>
      </div>
    </main>
  );
}