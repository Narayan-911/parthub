import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle,
  Car
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        {/* Newsletter Subscription Banner */}
        <div className="footer-newsletter-banner">
          <div className="newsletter-text">
            <h3>Subscribe to our <span>PartHub</span> Updates</h3>
            <p>Get exclusive drops, OEM compatibility releases, and motorsport performance discounts.</p>
          </div>

          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your automotive email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">
              {subscribed ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={18} /> Subscribed!
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Send size={18} /> Subscribe
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Structured Multi-Column Grid */}
        <div className="footer-columns-grid">
          {/* Column 1: Performance Kits & Products */}
          <div className="footer-column">
            <h4>Performance Kits</h4>
            <ul>
              <li><Link to="/products?search=BMW">BMW Full Kit (M-Series)</Link></li>
              <li><Link to="/products?search=Mustang">Mustang Full Kit (GT / Cobra)</Link></li>
              <li><Link to="/products?search=Mercedes">Mercedes Full Kit (AMG Dynamic)</Link></li>
              <li><Link to="/products?category=Filters">OEM & Sport Air Filters</Link></li>
              <li><Link to="/products?category=Drivetrain">CV Joints & Axle Parts</Link></li>
              <li><Link to="/products?category=Engine%20Parts">Performance Camshafts</Link></li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home Showcase</Link></li>
              <li><Link to="/products">Browse All Parts</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/about">About PartHub</Link></li>
              <li><Link to="/login">Customer Portal</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="footer-column">
            <h4>Contact Details</h4>
            <div className="footer-contact-item">
              <MapPin size={18} />
              <span>440 Speedster Blvd, Detroit, MI 48201</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={18} />
              <span>+1 (800) 555-PARTS (7278)</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={18} />
              <span>support@parthub.auto</span>
            </div>
            <div className="footer-contact-item">
              <Car size={18} />
              <span>Mon - Fri: 8:00 AM - 7:00 PM EST</span>
            </div>
          </div>

          {/* Column 4: Company Info */}
          <div className="footer-column">
            <h4>Company Info</h4>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1rem', color: '#a0aec0' }}>
              PartHub is the premier automotive engineering marketplace providing certified OEM replacement parts, track-tested performance kits, and motorsport hardware.
            </p>
            <div style={{ display: 'inline-block', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              🔒 100% Guaranteed Fitment
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="footer-bottom-bar">
          <div className="footer-social-links">
            {/* Twitter / X */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="X Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* GitHub */}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          </div>

          <div className="footer-copyright">
            PartHub Ltd. &copy; {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
