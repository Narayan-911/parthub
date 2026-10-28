import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, PackageCheck, MapPin, ArrowRight, Printer } from 'lucide-react';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((res) => {
        if (res.data?.data) {
          setOrder(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load order receipt:', err);
        setError('Unable to load order details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#a0aec0' }}>
        Loading order confirmation receipt...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Order Confirmation</h2>
        <p style={{ color: '#feb2b2', marginBottom: '1.5rem' }}>{error || 'Order record not found.'}</p>
        <Link to="/products" className="btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(72, 187, 120, 0.12)', borderRadius: '50%', color: '#48bb78', marginBottom: '1rem' }}>
          <CheckCircle2 size={52} />
        </div>
        <h1 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '0.4rem' }}>
          Order Confirmed!
        </h1>
        <p style={{ color: '#a0aec0', fontSize: '1rem' }}>
          Thank you for choosing PartHub. Your invoice receipt has been registered.
        </p>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#718096' }}>REFERENCE ORDER ID</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
              #{order._id}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#718096' }}>PAYMENT STATUS</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#48bb78' }}>
              PAID &bull; {order.paymentMethod}
            </div>
          </div>
        </div>

        {/* Shipping address banner */}
        <div style={{ background: '#0b0d12', padding: '1rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <MapPin size={22} color="var(--accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.2rem' }}>
              Dispatching to: {order.shippingAddress?.name} ({order.shippingAddress?.email})
            </div>
            <div style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
              {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
            </div>
          </div>
        </div>

        {/* Items breakdown */}
        <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PackageCheck size={18} color="var(--accent)" /> Ordered Parts ({order.orderItems?.length})
        </h4>

        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          {order.orderItems?.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', color: '#cbd5e0', fontSize: '0.95rem' }}>
              <span>{item.name} &times; {item.quantity}</span>
              <span style={{ fontWeight: 600, color: '#fff' }}>${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Total Paid</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>
            ${order.totalPrice?.toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={() => window.print()} className="btn-secondary">
          <Printer size={16} /> Print Receipt
        </button>
        <Link to="/products" className="btn-primary">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
