import { useNavigate } from 'react-router-dom';
import StaffLayout from '../components/StaffLayout';
import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';

function StaffHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, courses: 0 });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await adminAPI.getDashboardStats();
        if (isMounted) setStats({ users: data.users || 0, courses: data.courses || 0 });
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
            <p className="card-count">{stats.users}</p>
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
            <p className="card-count">{stats.courses}</p>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

export default StaffHome;
