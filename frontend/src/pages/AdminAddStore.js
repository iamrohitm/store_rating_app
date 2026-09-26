import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminAddStore() {
  const [form, setForm] = useState({ name: "", email: "", address: "", owner_id: "" });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api
      .get("/admin/users", { params: { role: "owner" } })
      .then((res) => setOwners(res.data))
      .catch(() => {});
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/admin/stores", { ...form, owner_id: form.owner_id || null });
      setSuccess("Store added successfully");
      setForm({ name: "", email: "", address: "", owner_id: "" });
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e) => e.msg).join(", "));
      } else {
        setError(err.response?.data?.message || "Failed to add store");
      }
    }
  }

  return (
    <div className="form-container">
      <h2>Add New Store</h2>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>Store Name (20-60 characters)</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Address (max 400 characters)</label>
        <textarea name="address" value={form.address} onChange={handleChange} required />

        <label>Store Owner (optional)</label>
        <select name="owner_id" value={form.owner_id} onChange={handleChange}>
          <option value="">-- None --</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name} ({o.email})
            </option>
          ))}
        </select>

        <button type="submit">Add Store</button>
      </form>
    </div>
  );
}
