import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const { register, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 4) {
      const msg = 'Password must be at least 4 characters long';
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      await register(formData);
      toast.success(`Welcome to PartHub, ${formData.name}! Your account is active.`);
      navigate('/products');
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="form-card">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.8rem', background: 'rgba(229,62,62,0.12)', borderRadius: '50%', color: 'var(--accent)', marginBottom: '1rem' }}>
          <UserPlus size={28} />
        </div>
        <h2 style={{ color: '#fff', fontSize: '1.85rem', marginBottom: '0.4rem', fontWeight: 700 }}>
          Create <span style={{ color: 'var(--accent)' }}>Account</span>
        </h2>
        <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
          Join the PartHub automotive marketplace community
        </p>
      </div>

      {error && (
        <div className="form-alert form-alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="form-control"
            placeholder="e.g. John Shelby"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="form-control"
            placeholder="e.g. jshelby"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="form-control"
            placeholder="e.g. john@motorsports.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="password">Password (minimum 4 characters)</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="form-control"
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', fontSize: '1rem', padding: '0.85rem', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={18} />
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#a0aec0' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          Log In Here
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
