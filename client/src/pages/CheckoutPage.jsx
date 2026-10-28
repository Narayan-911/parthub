import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  Truck, 
  AlertCircle, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Form fields matching checkout.php
  const [shippingData, setShippingData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '440 Speedster Way',
    city: 'Detroit',
    state: 'MI',
    zip: '48201',
  });

  // Simulated Payment section fields matching legacy checkout.php
  const [paymentData, setPaymentData] = useState({
    cardName: user?.name || 'Narayan Test',
    cardNumber: '4242 •••• •••• 4242',
    expMonth: '12',
    expYear: '2028',
    cvv: '888',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>No Items to Checkout</h2>
        <p style={{ color: '#a0aec0', marginBottom: '1.5rem' }}>Your shopping cart is currently empty.</p>
        <Link to="/products" className="btn-primary">Browse Catalog</Link>
      </div>
    );
  }

  const handleShippingChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate inputs
    if (!shippingData.name || !shippingData.email || !shippingData.address || !shippingData.city || !shippingData.state || !shippingData.zip) {
      setError('Please fill in all shipping address fields.');
      toast.error('Missing required shipping information');
      setLoading(false);
      return;
    }

    if (!paymentData.cardName || !paymentData.cardNumber || !paymentData.expMonth || !paymentData.expYear || !paymentData.cvv) {
      setError('Please complete all payment card details.');
      toast.error('Missing payment card fields');
      setLoading(false);
      return;
    }

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: shippingData.name.trim(),
          email: shippingData.email.trim(),
          address: shippingData.address.trim(),
          city: shippingData.city.trim(),
          state: shippingData.state.trim(),
          zip: shippingData.zip.trim(),
        },
        paymentMethod: 'Card (Simulated Sandbox)',
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data?.success && res.data?.data?._id) {
        toast.success('Payment authorized and order confirmed!');
        clearCart();
        navigate(`/order-success/${res.data.data._id}`);
      } else {
        throw new Error('Order creation was not acknowledged by the server');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to submit order';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/cart" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>
      </div>

      <div className="section-header">
        <div>
          <h1 className="section-title">Shipping & <span>Checkout</span></h1>
          <p className="section-subtitle">Secure dispatch processing for your precision automotive components</p>
        </div>
      </div>

      {error && (
        <div className="form-alert form-alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="cart-layout-grid">
        {/* Form Panel: Shipping Address + Simulated Payment */}
        <div className="cart-items-panel">
          <form id="checkout-form" onSubmit={handleSubmit}>
            {/* 1. Shipping Address Section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="var(--accent)" />
                <span>Shipping Address</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={shippingData.name}
                    onChange={handleShippingChange}
                    className="form-control"
                    placeholder="e.g. John Shelby"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={shippingData.email}
                    onChange={handleShippingChange}
                    className="form-control"
                    placeholder="e.g. driver@parthub.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={shippingData.address}
                  onChange={handleShippingChange}
                  className="form-control"
                  placeholder="e.g. 1240 N Motor Speedway Blvd"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={shippingData.city}
                    onChange={handleShippingChange}
                    className="form-control"
                    placeholder="Detroit"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State / Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={shippingData.state}
                    onChange={handleShippingChange}
                    className="form-control"
                    placeholder="MI"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zip">ZIP Code</label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    required
                    value={shippingData.zip}
                    onChange={handleShippingChange}
                    className="form-control"
                    placeholder="48201"
                  />
                </div>
              </div>
            </div>

            {/* 2. Simulated Payment Section matching checkout.php */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} color="var(--accent)" />
                  <span>Payment Information (Simulated)</span>
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#48bb78', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Lock size={14} /> 256-bit Encrypted
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  required
                  value={paymentData.cardName}
                  onChange={handlePaymentChange}
                  className="form-control"
                  placeholder="e.g. Carroll Shelby"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  required
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  className="form-control"
                  placeholder="4242 •••• •••• 4242"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="expMonth">Exp Month</label>
                  <input
                    type="text"
                    id="expMonth"
                    name="expMonth"
                    required
                    maxLength="2"
                    value={paymentData.expMonth}
                    onChange={handlePaymentChange}
                    className="form-control"
                    placeholder="MM"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expYear">Exp Year</label>
                  <input
                    type="text"
                    id="expYear"
                    name="expYear"
                    required
                    maxLength="4"
                    value={paymentData.expYear}
                    onChange={handlePaymentChange}
                    className="form-control"
                    placeholder="YYYY"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    required
                    maxLength="4"
                    value={paymentData.cvv}
                    onChange={handlePaymentChange}
                    className="form-control"
                    placeholder="CVC"
                  />
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)', color: '#a0aec0', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                💡 Sandbox Mode: No real funds will be charged. Server-side totals are verified and stock decrements automatically.
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary & Final Submission */}
        <div className="cart-summary-panel">
          <h3 style={{ color: '#fff', marginBottom: '1.25rem', fontSize: '1.25rem' }}>Review Items</h3>

          <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
            {cartItems.map((item) => (
              <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#cbd5e0' }}>{item.product.name} &times; {item.quantity}</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>${(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#a0aec0', fontSize: '0.9rem' }}>
              <span>Shipping Fee</span>
              <span style={{ color: '#48bb78', fontWeight: 600 }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Amount Payable</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>
                ${cartTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', fontSize: '1rem', padding: '0.9rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Authorizing & Placing Order...' : `Confirm Order ($${cartTotal.toLocaleString()})`}
          </button>

          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.8rem', justifyContent: 'center' }}>
            <ShieldCheck size={16} color="#48bb78" />
            <span>Guaranteed Safe & Encrypted Dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
