import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, KeyRound, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { login, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setIdentifier('narayan');
    setPassword('1234');
    toast.info('Filled default test credentials (narayan / 1234)');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(identifier, password);
      toast.success('Signed in successfully! Welcome back.');
      navigate('/products');
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.message || 'Invalid username/email or password';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="form-card">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.8rem', background: 'rgba(229,62,62,0.12)', borderRadius: '50%', color: 'var(--accent)', marginBottom: '1rem' }}>
          <Lock size={28} />
        </div>
        <h2 style={{ color: '#fff', fontSize: '1.85rem', marginBottom: '0.4rem', fontWeight: 700 }}>
          Customer <span style={{ color: 'var(--accent)' }}>Sign In</span>
        </h2>
        <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
          Access your PartHub orders and saved garage vehicles
        </p>
      </div>

      {error && (
        <div className="form-alert form-alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Fill Demo Button */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={handleFillDemo}
          style={{ 
            background: 'rgba(229,62,62,0.12)', 
            border: '1px dashed rgba(229,62,62,0.4)', 
            color: 'var(--accent)', 
            padding: '0.45rem 0.9rem', 
            borderRadius: '6px', 
            fontSize: '0.84rem', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem',
            cursor: 'pointer'
          }}
        >
          <KeyRound size={14} /> Quick-Fill Demo User (narayan / 1234)
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="identifier">Username or Email</label>
          <input
            type="text"
            id="identifier"
            required
            className="form-control"
            placeholder="e.g. narayan or narayan1@gmail.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            className="form-control"
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', fontSize: '1rem', padding: '0.85rem', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#a0aec0' }}>
        Don't have an account yet?{' '}
        <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          Create an Account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
