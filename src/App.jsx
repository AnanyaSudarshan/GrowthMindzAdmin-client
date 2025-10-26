import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminHome from './pages/AdminHome';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import AdminStaff from './pages/AdminStaff';
import EditProfile from './pages/EditProfile';
import StaffHome from './pages/StaffHome';
import StaffUsers from './pages/StaffUsers';
import StaffCourses from './pages/StaffCourses';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/profile" element={<EditProfile />} />
        <Route path="/staff-home" element={<StaffHome />} />
        <Route path="/staff/users" element={<StaffUsers />} />
        <Route path="/staff/courses" element={<StaffCourses />} />
        <Route path="/staff/profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
