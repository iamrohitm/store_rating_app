import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/owner/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"));
  }, []);

  if (error) return <p className="error-text">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2>{data.store.name} - Dashboard</h2>
      <p>Average Rating: <strong>{data.averageRating}</strong></p>

      <h3>Users who rated this store</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {data.raters.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.rating}</td>
            </tr>
          ))}
          {data.raters.length === 0 && (
            <tr>
              <td colSpan="3">No ratings yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
