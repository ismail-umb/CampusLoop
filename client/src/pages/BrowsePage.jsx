import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ProfileCard from "../components/ProfileCard";
import FilterBar from "../components/FilterBar";

const initialFilters = {
  minBudget: "",
  maxBudget: "",
  cleanliness: "",
  sleepSchedule: "",
  studyHabits: "",
  leaseDurationMonths: ""
};

export default function BrowsePage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState(initialFilters);

  async function fetchProfiles(query = {}) {
    const res = await api.get("/profiles/browse", { params: query });
    setProfiles(res.data);
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function applyFilters() {
    await fetchProfiles(filters);
  }

  async function resetFilters() {
    setFilters(initialFilters);
    await fetchProfiles();
  }

  async function handleMessage(userId) {
    navigate(`/messages?user=${userId}`);
  }

  return (
    <main className="page">
      <div className="container">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        <div className="stack">
          {profiles.length === 0 ? (
            <div className="card">No matching profiles found.</div>
          ) : (
            profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onMessage={handleMessage}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}