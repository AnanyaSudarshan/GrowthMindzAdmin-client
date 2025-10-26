import AdminLayout from '../components/AdminLayout';

function AdminCourses() {
  return (
    <AdminLayout activeMenuItem="courses">
      <h1 className="page-header">Courses Management</h1>
      <p>This is the Courses management page.</p>
    </AdminLayout>
  );
}

export default AdminCourses;
