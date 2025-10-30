import { useEffect, useState } from 'react';
import StaffLayout from '../components/StaffLayout';
import { adminAPI } from '../services/api';
import '../App.css';

function StaffUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await adminAPI.getUsers();
        if (mounted) setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setUsers([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <StaffLayout activeMenuItem="users">
      <h1 className="page-header">Users Management</h1>
      
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email ID</th>
              <th>Course Opted</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.first_name || (user.name ? user.name.split(' ')[0] : '')}</td>
                <td>{user.last_name || (user.name ? user.name.split(' ').slice(1).join(' ') : '')}</td>
                <td>{user.email}</td>
                <td>{user.course_opted}</td>
                <td>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${user.progress}%` }}
                      >
                        <span className="progress-text">{user.progress}%</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}

export default StaffUsers;


