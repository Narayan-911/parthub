import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Search, ShoppingCart, CheckCircle, SlidersHorizontal, RefreshCw, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  'All',
  'Body & Performance Kits',
  'Drivetrain',
  'Filters',
  'Engine Parts',
  'Wheels',
  'Electrical',
  'Bearings',
  'Ignition',
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const { addToCart } = useCart();
  const toast = useToast();

  const fetchProducts = () => {
    setLoading(true);
    let endpoint = '/products';
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }
    if (selectedCategory && selectedCategory !== 'All') {
      params.append('category', selectedCategory);
    }

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    api.get(endpoint)
      .then((res) => {
        if (res.data?.data) {
          setProducts(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        toast.error('Could not retrieve catalog from server. Check database connection.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    searchParams.delete('search');
    setSearchParams(searchParams);
    // Trigger reload
    setTimeout(() => {
      fetchProducts();
    }, 50);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedId(product._id);
    toast.success(`Added ${product.name} to cart!`);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Automotive <span>Parts Catalog</span></h1>
          <p className="section-subtitle">Certified OEM components and high-output performance kits</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-toolbar">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search parts, BMW kits, sensors, bearings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                color: '#a0aec0',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          )}
        </form>

        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#a0aec0' }}>
          <RefreshCw size={32} className="animate-spin" style={{ marginBottom: '1rem', color: 'var(--accent)' }} />
          <p style={{ fontSize: '1.05rem' }}>Retrieving precision automotive inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <SlidersHorizontal size={42} color="#718096" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.3rem' }}>No matching parts found</h3>
          <p style={{ color: '#a0aec0', marginBottom: '1.5rem' }}>Try clearing your search query or choosing another category.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              searchParams.delete('search');
              searchParams.delete('category');
              setSearchParams(searchParams);
              fetchProducts();
            }}
            className="btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((prod) => (
            <div key={prod._id} className="product-card">
              <div className="product-image-container">
                <img src={prod.imageUrl} alt={prod.name} className="product-image" />
                <span className="product-badge-category">{prod.category}</span>
              </div>
              <div className="product-info">
                <h3 className="product-title">{prod.name}</h3>
                <p className="product-description">{prod.description}</p>
                <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '0.75rem' }}>
                  In Stock: <strong style={{ color: '#48bb78' }}>{prod.stock} units</strong>
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
    </div>
  );
};

export default ProductsPage;
