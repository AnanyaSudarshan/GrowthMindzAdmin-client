import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { adminAPI } from "../services/api";

function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, courses: 0, staff: 0 });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await adminAPI.getDashboardStats();
        if (isMounted) setStats(data);
      } catch (e) {
        // keep defaults on error
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <AdminLayout>
      <h1 className="page-header">Dashboard</h1>

      <div className="cards-container">
        {/* Users Card */}
        <div
          className="dashboard-card users-card"
          onClick={() => handleCardClick("/admin/users")}
        >
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h3>Users</h3>
            <p className="card-count">{stats.users}</p>
          </div>
        </div>

        {/* Courses Card */}
        <div
          className="dashboard-card courses-card"
          onClick={() => handleCardClick("/admin/courses")}
        >
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h3>Courses</h3>
            <p className="card-count">{stats.courses}</p>
          </div>
        </div>

        {/* Staff Card */}
        <div
          className="dashboard-card staff-card"
          onClick={() => handleCardClick("/admin/staff")}
        >
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Staff</h3>
            <p className="card-count">{stats.staff}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminHome;
