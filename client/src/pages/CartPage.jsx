import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Car,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const toast = useToast();

  const handleDecrease = (productId, currentQty, name) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    } else {
      removeFromCart(productId);
      toast.info(`Removed ${name} from cart`);
    }
  };

  const handleIncrease = (productId, currentQty) => {
    updateQuantity(productId, currentQty + 1);
  };

  const handleRemove = (productId, name) => {
    removeFromCart(productId);
    toast.info(`Removed ${name} from cart`);
  };

  const handleClear = () => {
    clearCart();
    toast.info('Shopping cart cleared');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem', maxWidth: '640px', margin: '0 auto' }}>
        {/* Empty State Illustration */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', 
            border: '1px solid var(--border-color)',
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
          }}
        >
          <Car size={56} color="var(--accent)" />
        </div>
        <h2 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 700, marginBottom: '0.6rem' }}>
          Your Garage Cart is Empty
        </h2>
        <p style={{ color: '#a0aec0', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
          You have no performance hardware or replacement components queued for order. Explore our catalog to find parts matching your vehicle.
        </p>
        <Link to="/products" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
          Browse Automotive Parts <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Your <span>Shopping Cart</span></h1>
          <p className="section-subtitle">Review selected precision parts and quantities</p>
        </div>
        <button
          onClick={handleClear}
          className="btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-layout-grid">
        {/* 1. Cart Table Panel */}
        <div className="cart-items-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#718096', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Product Name</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>Quantity</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Item Total</th>
                <th style={{ padding: '1rem 0.5rem', width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr 
                  key={item.product._id} 
                  style={{ borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' }}
                >
                  {/* Product Name & Thumbnail */}
                  <td style={{ padding: '1.25rem 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#161922' }} 
                      />
                      <div>
                        <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem' }}>
                          {item.product.name}
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Tag size={12} color="var(--accent)" /> {item.product.category || 'Automotive Parts'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Quantity with +/- Controls */}
                  <td style={{ padding: '1.25rem 0.5rem', textAlign: 'center' }}>
                    <div className="qty-controls" style={{ display: 'inline-flex', margin: '0 auto' }}>
                      <button
                        onClick={() => handleDecrease(item.product._id, item.quantity, item.product.name)}
                        className="qty-btn"
                        title="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrease(item.product._id, item.quantity)}
                        className="qty-btn"
                        title="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>

                  {/* Unit Price */}
                  <td style={{ padding: '1.25rem 0.5rem', textAlign: 'right', color: '#cbd5e0', fontSize: '0.95rem' }}>
                    ${item.product.price.toLocaleString()}
                  </td>

                  {/* Item Total */}
                  <td style={{ padding: '1.25rem 0.5rem', textAlign: 'right', fontWeight: 700, color: 'var(--accent)', fontSize: '1.05rem' }}>
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </td>

                  {/* Delete Item Button */}
                  <td style={{ padding: '1.25rem 0.5rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleRemove(item.product._id, item.product.name)}
                      style={{ background: 'transparent', color: '#718096', cursor: 'pointer', padding: '4px', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#e53e3e')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#718096')}
                      title="Remove from cart"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Cart Summary Panel */}
        <div className="cart-summary-panel">
          <h3 style={{ color: '#fff', marginBottom: '1.25rem', fontSize: '1.25rem' }}>Cart Summary</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#a0aec0' }}>
            <span>Items Count</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} units
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#a0aec0' }}>
            <span>Subtotal</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>${cartTotal.toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#a0aec0' }}>
            <span>Freight Dispatch</span>
            <span style={{ color: '#48bb78', fontWeight: 600 }}>FREE (Complimentary)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: '#a0aec0' }}>
            <span>Estimated Sales Tax</span>
            <span style={{ color: '#fff' }}>$0.00</span>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Grand Total</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>
              ${cartTotal.toLocaleString()}
            </span>
          </div>

          <Link to="/checkout" className="btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '0.85rem' }}>
            Proceed to Checkout <ArrowRight size={18} />
          </Link>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.8rem', justifyContent: 'center' }}>
            <ShieldCheck size={16} color="#48bb78" />
            <span>Encrypted 256-bit SSL Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
