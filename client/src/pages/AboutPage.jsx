import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Eye, 
  Layers, 
  HeartHandshake, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Sparkles 
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* 1. Mission Statement Header */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="hero-pill" style={{ marginBottom: '1rem' }}>
          <Sparkles size={16} /> Engineering Integrity & Passion
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem', letterSpacing: '-1px' }}>
          Welcome to <span style={{ color: 'var(--accent)' }}>Auto PartHub</span>
        </h1>
        <p style={{ maxWidth: '780px', margin: '0 auto', fontSize: '1.15rem', color: '#cbd5e0', lineHeight: '1.8' }}>
          At Auto PartHub, we are dedicated to fueling automotive passion with track-tested components, certified OEM standards, and transparent engineering. Whether you are rebuilding a classic Mustang engine, servicing high-mileage BMW suspension, or upgrading an AMG exhaust, we are your trusted garage partner.
        </p>
      </section>

      {/* 2. Alternating Split Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', marginBottom: '5rem' }}>
        
        {/* Section 1: Our Vision */}
        <section 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '3rem', 
            alignItems: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '2.5rem',
            overflow: 'hidden'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
              <Eye size={18} /> Our Vision
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', lineHeight: '1.2' }}>
              Setting the Standard for Automotive Precision
            </h2>
            <p style={{ color: '#a0aec0', lineHeight: '1.8', marginBottom: '1.25rem', fontSize: '0.98rem' }}>
              Our vision is to revolutionize how car enthusiasts, mechanics, and restorers discover and purchase vehicle components. We believe that true performance comes from flawless fitment, traceable material quality, and zero compromises on safety.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#cbd5e0', fontSize: '0.92rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#48bb78" /> Laser-verified dimensional tolerances
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#48bb78" /> Verified OEM compatibility documentation
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#48bb78" /> Zero counterfeit guarantee with full serial tracking
              </li>
            </ul>
          </div>
          <div style={{ borderRadius: '14px', overflow: 'hidden', height: '280px', boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}>
            <img 
              src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80" 
              alt="Auto PartHub Vision and Engine Tuning" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </section>

        {/* Section 2: Extensive Selection (Reversed Split) */}
        <section 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '3rem', 
            alignItems: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '2.5rem',
            overflow: 'hidden'
          }}
        >
          {/* Image First on Desktop */}
          <div style={{ borderRadius: '14px', overflow: 'hidden', height: '280px', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', order: 1 }}>
            <img 
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80" 
              alt="Auto PartHub Extensive Selection" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ order: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
              <Layers size={18} /> Extensive Selection
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', lineHeight: '1.2' }}>
              From Essential Hardware to Complete Race Kits
            </h2>
            <p style={{ color: '#a0aec0', lineHeight: '1.8', marginBottom: '1.25rem', fontSize: '0.98rem' }}>
              We curate comprehensive catalogs covering factory replacement spark plugs, SKF aerospace bearings, and high-flow air filters alongside complete turn-key aerodynamic packages for premier European and American muscle icons.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#cbd5e0', fontSize: '0.92rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#48bb78" /> Complete packages for BMW M, Mustang GT & AMG
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#48bb78" /> High-volume OEM replenishment parts
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#48bb78" /> Fast-dispatch warehouse facilities nationwide
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: Customer Satisfaction */}
        <section 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '3rem', 
            alignItems: 'center',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '2.5rem',
            overflow: 'hidden'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
              <HeartHandshake size={18} /> Customer Satisfaction
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', lineHeight: '1.2' }}>
              Driven by Real Automotive Technicians
            </h2>
            <p style={{ color: '#a0aec0', lineHeight: '1.8', marginBottom: '1.25rem', fontSize: '0.98rem' }}>
              When you call or chat with PartHub, you speak with ASE-certified mechanics, not an offshore call center. We assist with VIN fitment checks, torque specs, installation manuals, and warranty backing so your build goes smoothly.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#cbd5e0', fontSize: '0.92rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#48bb78" /> 24/7 online technical assistance
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#48bb78" /> 30-day hassle-free return window
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#48bb78" /> Dedicated vehicle fitment support
              </li>
            </ul>
          </div>
          <div style={{ borderRadius: '14px', overflow: 'hidden', height: '280px', boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}>
            <img 
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80" 
              alt="Auto PartHub Customer Satisfaction & Mechanic Support" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </section>

      </div>

      {/* 3. Join Our Community Banner */}
      <section 
        style={{ 
          background: 'linear-gradient(135deg, #181d26, #0e1117)', 
          border: '1px solid rgba(229, 62, 62, 0.3)', 
          borderRadius: '20px', 
          padding: '3.5rem 2.5rem', 
          textAlign: 'center',
          boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          marginBottom: '3rem'
        }}
      >
        <div style={{ display: 'inline-flex', padding: '0.8rem', background: 'rgba(229, 62, 62, 0.15)', borderRadius: '50%', color: 'var(--accent)', marginBottom: '1.25rem' }}>
          <Users size={32} />
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
          Join Our Auto PartHub Community
        </h2>
        <p style={{ maxWidth: '640px', margin: '0 auto 2rem', color: '#cbd5e0', fontSize: '1.05rem', lineHeight: '1.7' }}>
          Connect with over 50,000 drivers, track racers, and restorers. Get early access to limited kit releases, tuning guides, and motorsport discounts.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
          <Link to="/products" className="btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Browse Catalog
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
