import StaffLayout from '../components/StaffLayout';

function StaffCourses() {
  return (
    <StaffLayout activeMenuItem="courses">
      <h1 className="page-header">Courses Management</h1>
      <p>This is the Courses management page for Staff.</p>
    </StaffLayout>
  );
}

export default StaffCourses;


