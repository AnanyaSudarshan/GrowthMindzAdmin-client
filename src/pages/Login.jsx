import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GrowthMindzIcon from '../components/GrowthMindzIcon';
import '../App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear any previous error
    setError('');

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

    // Password validation
    // Check length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      setError('Password must contain at least one letter');
      return;
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      setError('Password must contain at least one number');
      return;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError('Password must contain at least one special character');
      return;
    }

    // Navigate based on role
    if (role === 'Admin') {
      navigate('/admin-home');
    } else if (role === 'Staff') {
      navigate('/staff-home');
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

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
