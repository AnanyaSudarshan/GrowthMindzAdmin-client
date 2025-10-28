import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminAPI } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import StaffLayout from '../components/StaffLayout';
import '../App.css';

function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  // Determine role and layout by url path
  const isAdmin = location.pathname.startsWith('/admin');
  const Layout = isAdmin ? AdminLayout : StaffLayout;

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: isAdmin ? 'Admin' : 'Staff',
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  }

  useEffect(() => {
    // Load profile from API
    (async () => {
      try {
        const data = await adminAPI.getProfile();
        setProfile(p => ({
          ...p,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || (isAdmin ? 'Admin' : 'Staff'),
          password: '',
          confirmPassword: ''
        }));
      } catch (err) {
        console.error('Load profile failed', err);
      }
    })();
  }, [isAdmin]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    if (!profile.name.trim()) return setError('Name required');
    if (!profile.phone.trim()) return setError('Phone required');
    if (profile.password && profile.password.length < 6) return setError('Password must be at least 6 characters');
    if (profile.password !== profile.confirmPassword) return setError('Passwords do not match');

    try {
      await adminAPI.updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        password: profile.password, // maps to DB field 'password' via API
        confirm_password: profile.confirmPassword, // maps to API expected 'confirm_password'
      });
      // Refetch latest profile to reflect DB values
      const fresh = await adminAPI.getProfile();
      setProfile(p => ({
        ...p,
        name: fresh.name || p.name,
        email: fresh.email || p.email,
        phone: fresh.phone || p.phone,
        role: fresh.role || p.role,
        password: '',
        confirmPassword: ''
      }));
      setEditMode(false);
      setSuccess('Profile updated!');
      setTimeout(() => setSuccess(''), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    // reload fields (simulate reload); for real app would refetch
    setProfile({
      name: isAdmin ? 'Admin User' : 'Staff User',
      email: isAdmin ? 'admin@growthmindz.com' : 'staff@growthmindz.com',
      password: '',
      confirmPassword: '',
      phone: isAdmin ? '+91 98765 43210' : '+91 98765 43201',
      role: isAdmin ? 'Admin' : 'Staff',
    });
    setEditMode(false);
    setError('');
  }

  return (
    <Layout activeMenuItem="profile">
      <div className="profile-container">
        <h1 className="page-header">Edit Profile</h1>
        <div className="profile-card">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={profile.email}
                name="email"
                disabled
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <small className="form-text text-muted">Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={profile.name}
                disabled={!editMode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={profile.phone}
                disabled={!editMode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-control"
                value={profile.role}
                name="role"
                disabled
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={profile.password}
                disabled={!editMode}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />
            </div>
            {editMode && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={profile.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
              </div>
            )}
            <div className="form-actions">
              {editMode ? (
                <>
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >Cancel</button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setEditMode(true)}
                >Edit</button>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate(isAdmin ? '/admin-home' : '/staff-home')
                }>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default EditProfile;













