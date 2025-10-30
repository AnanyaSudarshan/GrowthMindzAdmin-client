import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GrowthMindzIcon from './GrowthMindzIcon';

function StaffLayout({ children, activeMenuItem = '' }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const userEmail = 'staff@mindsetmovez.com';
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside (only when open)
  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    navigate('/login', {state: {logoutSuccess: true}});
  };

  const handleLogoClick = () => {
    navigate('/staff-home');
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleEditProfile = () => {
    navigate('/staff/profile');
    setShowDropdown(false);
  };

  return (
    <div className="admin-container">
      {/* Top Navbar */}
      <nav className="admin-navbar">
        <div className="navbar-left">
          <button 
            className="logo-button"
            onClick={handleLogoClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0'
            }}
          >
            <GrowthMindzIcon />
            <span className="navbar-brand">MindsetMovez</span>
          </button>
        </div>
        {/* Navbar right removed as per requirement */}
      </nav>

      <div className="admin-content-wrapper">
        {/* Left Sidebar - Only Courses and Users */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li className={`sidebar-item ${activeMenuItem === 'courses' ? 'active' : ''}`}>
              <button onClick={() => handleMenuClick('/staff/courses')}>
                📚 Courses
              </button>
            </li>
            <li className={`sidebar-item ${activeMenuItem === 'users' ? 'active' : ''}`}>
              <button onClick={() => handleMenuClick('/staff/users')}>
                👥 Users
              </button>
            </li>
            <li className={`sidebar-item ${activeMenuItem === 'profile' ? 'active' : ''}`}>
              <button onClick={() => handleMenuClick('/staff/profile')}>
                📝 Edit Profile
              </button>
            </li>
          </ul>
          <button className="btn btn-danger logout-btn" style={{marginTop: 'auto', width: '90%', marginLeft:'5%', marginBottom:'20px'}} onClick={() => handleLogout()}>
            🚪 Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default StaffLayout;













