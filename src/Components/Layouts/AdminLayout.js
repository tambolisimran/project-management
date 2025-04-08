import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminDashboard from "../components/AdminDashboard";

const AdminLayout = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role || role !== "ADMIN") {
      navigate("/login");
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  return (
    <div style={{ display: "flex" }}>
      {userRole === "ADMIN" && <Sidebar />}
      <AdminDashboard />
    </div>
  );
};

export default AdminLayout;
