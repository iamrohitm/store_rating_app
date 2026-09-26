import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UpdatePassword from "./pages/UpdatePassword";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetail from "./pages/AdminUserDetail";
import AdminStores from "./pages/AdminStores";
import AdminAddUser from "./pages/AdminAddUser";
import AdminAddStore from "./pages/AdminAddStore";

import UserStores from "./pages/UserStores";
import OwnerDashboard from "./pages/OwnerDashboard";

import "./App.css";

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "owner") return <Navigate to="/owner" replace />;
  return <Navigate to="/stores" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/update-password"
              element={
                <ProtectedRoute>
                  <UpdatePassword />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminUserDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-user"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminAddUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-store"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminAddStore />
                </ProtectedRoute>
              }
            />

            {/* Normal user routes */}
            <Route
              path="/stores"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserStores />
                </ProtectedRoute>
              }
            />

            {/* Store owner routes */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
