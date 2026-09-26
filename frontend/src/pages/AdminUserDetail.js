import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => setError("Failed to load user"));
  }, [id]);

  if (error) return <p className="error-text">{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2>User Details</h2>
      <table className="detail-table">
        <tbody>
          <tr><td>Name</td><td>{user.name}</td></tr>
          <tr><td>Email</td><td>{user.email}</td></tr>
          <tr><td>Address</td><td>{user.address}</td></tr>
          <tr><td>Role</td><td>{user.role}</td></tr>
          {user.role === "owner" && <tr><td>Store Rating</td><td>{user.rating}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
