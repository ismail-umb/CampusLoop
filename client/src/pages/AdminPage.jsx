import { useEffect, useState } from "react";
import api from "../api";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  async function loadData() {
    const [usersRes, reportsRes] = await Promise.all([
      api.get("/admin/users"),
      api.get("/admin/reports")
    ]);

    setUsers(usersRes.data);
    setReports(reportsRes.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function suspendUser(id) {
    await api.patch(`/admin/users/${id}/suspend`);
    await loadData();
  }

  async function restoreUser(id) {
    await api.patch(`/admin/users/${id}/restore`);
    await loadData();
  }

  async function resolveReport(id) {
    await api.patch(`/admin/reports/${id}/resolve`);
    await loadData();
  }

  return (
    <main className="page">
      <div className="container">
        <div className="card">
          <h2>Admin Dashboard</h2>
          <p className="muted">Moderate flagged accounts and manage user access.</p>
        </div>

        <div className="card">
          <h3>Flagged Reports</h3>
          {reports.length === 0 ? (
            <p>No reports yet.</p>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="admin-row">
                <div>
                  <strong>{report.reason}</strong>
                  <p className="muted">
                    Reporter: {report.reporter?.email} | Reported: {report.reportedUser?.email || "N/A"}
                  </p>
                  <p>{report.note || "No note provided"}</p>
                </div>
                <div className="actions">
                  {!report.resolved && (
                    <button className="btn" onClick={() => resolveReport(report.id)}>
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h3>Users</h3>
          {users.map((user) => (
            <div key={user.id} className="admin-row">
              <div>
                <strong>{user.firstName} {user.lastName}</strong>
                <p className="muted">{user.email}</p>
              </div>
              <div className="actions">
                {user.isSuspended ? (
                  <button className="btn btn-outline" onClick={() => restoreUser(user.id)}>
                    Restore
                  </button>
                ) : (
                  <button className="btn danger" onClick={() => suspendUser(user.id)}>
                    Suspend
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}