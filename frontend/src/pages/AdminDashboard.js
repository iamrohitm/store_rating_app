import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load dashboard stats"));
  }, []);

  return (
    <div className="page-container">
      <h2>Admin Dashboard</h2>
      {error && <p className="error-text">{error}</p>}
      {stats && (
        <div className="stats-grid">
          <div className="stat-box">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-box">
            <h3>{stats.totalStores}</h3>
            <p>Total Stores</p>
          </div>
          <div className="stat-box">
            <h3>{stats.totalRatings}</h3>
            <p>Total Ratings</p>
          </div>
        </div>
      )}
    </div>
  );
}
