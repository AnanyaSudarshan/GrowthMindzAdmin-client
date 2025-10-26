import { useNavigate } from 'react-router-dom';
import StaffLayout from '../components/StaffLayout';

function StaffHome() {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <StaffLayout>
      <h1 className="page-header">Dashboard</h1>
      
      <div className="cards-container">
        {/* Users Card */}
        <div 
          className="dashboard-card users-card"
          onClick={() => handleCardClick('/staff/users')}
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
          onClick={() => handleCardClick('/staff/courses')}
        >
          <div className="card-icon">📚</div>
          <div className="card-content">
            <h3>Courses</h3>
            <p className="card-count">45</p>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

export default StaffHome;
