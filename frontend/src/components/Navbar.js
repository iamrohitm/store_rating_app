import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-title">Store Rating App</div>
      <div className="navbar-links">
        {user && user.role === "admin" && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
            <Link to="/admin/add-user">Add User</Link>
            <Link to="/admin/add-store">Add Store</Link>
          </>
        )}
        {user && user.role === "user" && <Link to="/stores">Stores</Link>}
        {user && user.role === "owner" && <Link to="/owner">Dashboard</Link>}
        {user && <Link to="/update-password">Update Password</Link>}
        {user ? (
          <>
            <span className="navbar-user">{user.name} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
