import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Wrench, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <Wrench className="brand-icon" size={26} />
          <span>Part<span className="brand-badge">Hub</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="nav-links-desktop">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                About
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Action Controls (Cart, Auth, Mobile Toggle) */}
        <div className="navbar-actions">
          {/* Cart Icon & Badge */}
          <Link to="/cart" className="nav-action-btn" title="View Shopping Cart">
            <div className="cart-icon-wrapper">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <span>Cart</span>
          </Link>

          {/* User Profile / Auth State */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="user-tag" title={`Logged in as ${user?.email}`}>
                <ShieldCheck size={16} color="#48bb78" />
                <span>{user?.name || user?.username}</span>
              </span>
              <button onClick={handleLogout} className="nav-action-btn" title="Log Out">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="auth-btn-primary">
              <User size={18} />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className="burger-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <NavLink to="/" className="nav-link" onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className="nav-link" onClick={closeMenu}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="nav-link" onClick={closeMenu}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className="nav-link" onClick={closeMenu}>
              Cart ({cartCount})
            </NavLink>
          </li>
        </ul>

        <div className="mobile-nav-actions">
          {isAuthenticated ? (
            <>
              <div className="user-tag" style={{ justifyContent: 'center' }}>
                <ShieldCheck size={16} color="#48bb78" />
                <span>Signed in: {user?.name || user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="nav-action-btn"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link
                to="/login"
                className="auth-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={closeMenu}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="nav-action-btn"
                style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)' }}
                onClick={closeMenu}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
