import { useEffect, useState } from "react";
import api from "../api/axios";

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function fetchStores() {
    api
      .get("/user/stores", { params: search })
      .then((res) => setStores(res.data))
      .catch(() => setError("Failed to load stores"));
  }

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearchChange(e) {
    setSearch({ ...search, [e.target.name]: e.target.value });
  }

  async function handleRate(storeId, rating) {
    setError("");
    setMessage("");
    try {
      await api.post(`/user/stores/${storeId}/rating`, { rating });
      setMessage("Rating saved");
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save rating");
    }
  }

  return (
    <div className="page-container">
      <h2>Stores</h2>
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      <div className="filter-bar">
        <input name="name" placeholder="Search by name" value={search.name} onChange={handleSearchChange} />
        <input name="address" placeholder="Search by address" value={search.address} onChange={handleSearchChange} />
        <button onClick={fetchStores}>Search</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Rate this store</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.overall_rating}</td>
              <td>{s.user_rating ?? "Not rated"}</td>
              <td>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) handleRate(s.id, parseInt(e.target.value));
                  }}
                >
                  <option value="" disabled>
                    {s.user_rating ? "Modify rating" : "Select rating"}
                  </option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
