import { useState } from "react";
import api from "../api/axios";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.put("/auth/update-password", { password });
      setSuccess("Password updated successfully");
      setPassword("");
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e) => e.msg).join(", "));
      } else {
        setError(err.response?.data?.message || "Failed to update password");
      }
    }
  }

  return (
    <div className="form-container">
      <h2>Update Password</h2>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>New Password (8-16 chars, 1 uppercase, 1 special char)</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}
