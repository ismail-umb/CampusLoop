export default function FilterBar({ filters, setFilters, onApply, onReset }) {
  function updateField(e) {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <div className="card">
      <h3>Filter Matches</h3>
      <div className="grid three">
        <input name="minBudget" placeholder="Min budget" value={filters.minBudget} onChange={updateField} />
        <input name="maxBudget" placeholder="Max budget" value={filters.maxBudget} onChange={updateField} />
        <select name="cleanliness" value={filters.cleanliness} onChange={updateField}>
          <option value="">Cleanliness</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>

        <select name="sleepSchedule" value={filters.sleepSchedule} onChange={updateField}>
          <option value="">Sleep schedule</option>
          <option value="EARLY_BIRD">EARLY_BIRD</option>
          <option value="FLEXIBLE">FLEXIBLE</option>
          <option value="NIGHT_OWL">NIGHT_OWL</option>
        </select>

        <select name="studyHabits" value={filters.studyHabits} onChange={updateField}>
          <option value="">Study habits</option>
          <option value="QUIET">QUIET</option>
          <option value="MODERATE">MODERATE</option>
          <option value="COLLABORATIVE">COLLABORATIVE</option>
        </select>

        <input
          name="leaseDurationMonths"
          placeholder="Lease months"
          value={filters.leaseDurationMonths}
          onChange={updateField}
        />
      </div>

      <div className="actions">
        <button className="btn" onClick={onApply}>Apply Filters</button>
        <button className="btn btn-outline" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}