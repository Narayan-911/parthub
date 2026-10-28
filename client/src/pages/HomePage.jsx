import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Gauge, 
  Award, 
  ShoppingCart, 
  CheckCircle,
  Sparkles,
  Flame,
  Layers
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

// Exact requested category pills
const HOME_CATEGORY_PILLS = [
  { label: 'Brakes', category: 'Brakes', icon: '🛑' },
  { label: 'Filters', category: 'Filters', icon: '💨' },
  { label: 'Engine', category: 'Engine Parts', icon: '⚙️' },
  { label: 'Wheels', category: 'Wheels', icon: '🛞' },
  { label: 'Kits', category: 'Body & Performance Kits', icon: '🏎️' },
];

const HomePage = () => {
  const [topPicks, setTopPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        if (res.data?.data) {
          // Display top picks (curated high-performance items)
          setTopPicks(res.data.data.slice(0, 6));
        }
      })
      .catch((err) => {
        console.warn('Backend not reachable:', err.message);
        toast.error('Unable to load latest inventory from server');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedId(product._id);
    toast.success(`Added ${product.name} to cart!`);
    setTimeout(() => setAddedId(null), 1800);
  };

  const handlePillClick = (cat) => {
    navigate(`/products?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={16} /> Track-Tested & OEM Certified
          </div>
          <h1 className="hero-title">
            Precision Performance <span>Automotive Parts</span>
          </h1>
          <p className="hero-subtitle">
            Upgrade your machine with factory OEM components, aerospace-grade bearings, and full racing kit packages built for BMW, Mustang, and Mercedes.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">
              Shop Parts Catalog <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn-secondary">
              About Auto PartHub
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Category Navigation Pills */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="var(--accent)" /> Browse by Popular Vehicle Category
          </h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
          {HOME_CATEGORY_PILLS.map((pill) => (
            <button
              key={pill.label}
              onClick={() => handlePillClick(pill.category)}
              className="category-nav-pill"
              style={{
                background: 'var(--bg-surface)',
                color: '#ffffff',
                border: '1px solid var(--border-color)',
                padding: '0.75rem 1.5rem',
                borderRadius: '30px',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
              }}
            >
              <span>{pill.icon}</span>
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Top Picks Grid */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Flame size={26} color="var(--accent)" /> Top Picks <span>Hardware</span>
            </h2>
            <p className="section-subtitle">Specially selected enthusiast upgrades & OEM certified components</p>
          </div>
          <Link to="/products" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            View Full Inventory <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#a0aec0' }}>
            Loading precision components...
          </div>
        ) : (
          <div className="products-grid">
            {topPicks.map((prod) => (
              <div key={prod._id} className="product-card">
                <div className="product-image-container">
                  <img src={prod.imageUrl} alt={prod.name} className="product-image" />
                  <span className="product-badge-category">{prod.category}</span>
                </div>
                <div className="product-info">
                  <h3 className="product-title">{prod.name}</h3>
                  <p className="product-description">{prod.description}</p>
                  <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '0.75rem' }}>
                    Availability: <strong style={{ color: '#48bb78' }}>In Stock ({prod.stock})</strong>
                  </div>
                  <div className="product-footer">
                    <div className="product-price">
                      <span>$</span>{prod.price.toLocaleString()}
                    </div>
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="product-add-btn"
                    >
                      {addedId === prod._id ? (
                        <>
                          <CheckCircle size={16} /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trust & Guarantee Banners */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper"><ShieldCheck size={26} /></div>
          <div className="feature-text">
            <h4>100% Fitment Guarantee</h4>
            <p>Every component is cross-referenced with manufacturer VIN specifications.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper"><Gauge size={26} /></div>
          <div className="feature-text">
            <h4>Dyno-Proven Quality</h4>
            <p>Components engineered to withstand extreme thermals, torque, and track pressure.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper"><Truck size={26} /></div>
          <div className="feature-text">
            <h4>Express Freight Shipping</h4>
            <p>Rapid dispatch directly to your garage or certified service technician.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper"><Award size={26} /></div>
          <div className="feature-text">
            <h4>Motorsport Warranty</h4>
            <p>Backed by our comprehensive 2-year manufacturer defect guarantee.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
