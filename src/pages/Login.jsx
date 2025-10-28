import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GrowthMindzIcon from '../components/GrowthMindzIcon';
import { adminAPI } from '../services/api';
import '../App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:5001/api/admin/login', { email, password, role });
      if (response.data.message === 'Login successful') {
        navigate('/admin-home');
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
    // Clear any previous error
    setError('');
    setIsLoading(true);

    try {
      // Validation: All fields required
      if (!email.trim() || !password.trim() || !role) {
        setError('All fields are required');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address (e.g., user@example.com)');
        return;
      }

      // Call API to login
      const response = await adminAPI.login(email, password, role);
      
      if (response.message === 'Login successful') {
        // Navigate based on role
        if (role === 'Admin') {
          navigate('/admin-home');
        } else if (role === 'Staff') {
          navigate('/staff-home');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <GrowthMindzIcon />
          <h2 className="logo-title">GrowthMindz</h2>
        </div>
        <h2 className="page-title">Login</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              className="form-select"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
