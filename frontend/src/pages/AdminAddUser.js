import { useState } from "react";
import api from "../api/axios";

export default function AdminAddUser() {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/admin/users", form);
      setSuccess("User added successfully");
      setForm({ name: "", email: "", address: "", password: "", role: "user" });
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e) => e.msg).join(", "));
      } else {
        setError(err.response?.data?.message || "Failed to add user");
      }
    }
  }

  return (
    <div className="form-container">
      <h2>Add New User</h2>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name (20-60 characters)</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Address (max 400 characters)</label>
        <textarea name="address" value={form.address} onChange={handleChange} required />

        <label>Password (8-16 chars, 1 uppercase, 1 special char)</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />

        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">Normal User</option>
          <option value="admin">Admin</option>
          <option value="owner">Store Owner</option>
        </select>

        <button type="submit">Add User</button>
      </form>
    </div>
  );
}
