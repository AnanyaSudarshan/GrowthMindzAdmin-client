import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

function AdminHome() {
  const navigate = useNavigate();

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
          onClick={() => handleCardClick('/admin/users')}
        >
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h3>Users</h3>
            <p className="card-count">1,234</p>
          </div>
        </div>

        {/* Courses Card */}
        <div 
          className="dashboard-card courses-card"
          onClick={() => handleCardClick('/admin/courses')}
        >
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h3>Courses</h3>
            <p className="card-count">45</p>
          </div>
        </div>

        {/* Staff Card */}
        <div 
          className="dashboard-card staff-card"
          onClick={() => handleCardClick('/admin/staff')}
        >
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Staff</h3>
            <p className="card-count">87</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminHome;
