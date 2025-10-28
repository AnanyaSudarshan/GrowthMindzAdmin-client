import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { adminAPI } from "../services/api";
import "../App.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await adminAPI.getUsers();
        if (isMounted) setUsers(data);
      } catch (e) {
        setUsers([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

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
