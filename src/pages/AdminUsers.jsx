import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import '../App.css';

function AdminUsers() {
  // Sample user data - in real app, this would come from an API
  const [users] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      course: 'Data Science Fundamentals',
      progress: 75
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      course: 'Full Stack Development',
      progress: 45
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      course: 'Data Science Fundamentals',
      progress: 90
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      course: 'Python Programming',
      progress: 30
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      course: 'Full Stack Development',
      progress: 60
    },
    {
      id: 6,
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
      course: 'Python Programming',
      progress: 55
    }
  ]);

  return (
    <AdminLayout activeMenuItem="users">
      <h1 className="page-header">Users Management</h1>
      
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email ID</th>
              <th>Course Opted</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.course}</td>
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
    </AdminLayout>
  );
}

export default AdminUsers;
