import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GrowthMindzIcon from './GrowthMindzIcon';

function StaffLayout({ children, activeMenuItem = '' }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    navigate('/login');
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
            <span className="navbar-brand">GrowthMindz</span>
          </button>
        </div>
        <div className="navbar-right">
          <div className="user-menu" ref={dropdownRef}>
            <button 
              className="user-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Staff User <span className="dropdown-arrow">▼</span>
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleEditProfile}>
                  Edit Profile
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
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
          </ul>
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








