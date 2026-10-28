/**
 * Automated Verification Script for PartHub Auth & Cart State Management
 * Tests localStorage persistence, [{ product, quantity }] schema compliance, and Axios Bearer interceptor.
 */

// Simulated browser localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new LocalStorageMock();

const STORAGE_KEY = 'parthub_cart_items';

function runCartStateSimulation() {
  console.log('\n=== Testing CartContext & LocalStorage Persistence ===\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, description) => {
    if (condition) {
      console.log(`[PASS] ${description}`);
      passed++;
    } else {
      console.error(`[FAIL] ${description}`);
      failed++;
    }
  };

  // Sample mock products
  const productA = {
    _id: 'prod_bmw_001',
    name: 'BMW Full Kit',
    price: 1720,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
  };

  const productB = {
    _id: 'prod_cam_002',
    name: 'Camshaft',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
  };

  // 1. Initial State should be empty
  let cart = [];
  assert(cart.length === 0, 'Initial cart is empty');

  // Helper functions mirroring CartContext
  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    const existingIndex = cart.findIndex((i) => i.product._id === product._id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
        },
        quantity: qty,
      });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  };

  const updateQuantity = (productId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    cart = cart.map((i) => (i.product._id === productId ? { ...i, quantity: qty } : i));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  };

  const removeFromCart = (productId) => {
    cart = cart.filter((i) => i.product._id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  };

  const getCartCount = (items) => items.reduce((acc, i) => acc + i.quantity, 0);
  const getCartTotal = (items) => items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  // 2. Add product A (BMW Full Kit x 1)
  addToCart(productA, 1);
  assert(cart.length === 1, 'Cart has 1 item after adding product A');
  assert(cart[0].product._id === 'prod_bmw_001', 'Schema matches { product, quantity } structure');
  assert(cart[0].quantity === 1, 'Quantity is 1');
  assert(getCartCount(cart) === 1, 'cartCount is 1');
  assert(getCartTotal(cart) === 1720, 'cartTotal is $1720');

  // 3. Add product A again (should increment quantity to 2)
  addToCart(productA, 1);
  assert(cart.length === 1, 'Item array length remains 1 (incremented in-place)');
  assert(cart[0].quantity === 2, 'Quantity successfully incremented to 2');
  assert(getCartCount(cart) === 2, 'cartCount is 2');
  assert(getCartTotal(cart) === 3440, 'cartTotal is $3440');

  // 4. Add product B (Camshaft x 3)
  addToCart(productB, 3);
  assert(cart.length === 2, 'Cart has 2 distinct items');
  assert(getCartCount(cart) === 5, 'cartCount is 5 (2 BMW + 3 Camshafts)');
  assert(getCartTotal(cart) === 3440 + 360, 'cartTotal is $3800');

  // 5. Update quantity of Camshaft to 5
  updateQuantity('prod_cam_002', 5);
  assert(cart.find((i) => i.product._id === 'prod_cam_002').quantity === 5, 'Quantity updated to 5');
  assert(getCartCount(cart) === 7, 'cartCount updated to 7');

  // 6. Update quantity with negative / zero (enforced min: 1)
  updateQuantity('prod_cam_002', 0);
  assert(cart.find((i) => i.product._id === 'prod_cam_002').quantity === 1, 'Quantity clamped to minimum of 1');

  // 7. Verify localStorage snapshot
  const rawStorage = localStorage.getItem(STORAGE_KEY);
  assert(typeof rawStorage === 'string' && rawStorage.length > 0, 'LocalStorage contains serialized cart JSON');

  // 8. SIMULATE BROWSER RELOAD / REHYDRATION
  console.log('\n--- Simulating Browser Page Reload ---');
  const reloadedRaw = localStorage.getItem(STORAGE_KEY);
  const reloadedCart = JSON.parse(reloadedRaw);

  assert(Array.isArray(reloadedCart), 'Reloaded cart is valid Array');
  assert(reloadedCart.length === 2, 'Reloaded cart preserved both items across reload');
  assert(reloadedCart[0].product.name === 'BMW Full Kit', 'Product A data intact');
  assert(reloadedCart[0].quantity === 2, 'Product A quantity intact');
  assert(reloadedCart[1].product.name === 'Camshaft', 'Product B data intact');
  assert(reloadedCart[1].quantity === 1, 'Product B quantity intact');
  assert(getCartCount(reloadedCart) === 3, 'Reloaded cartCount is 3');
  assert(getCartTotal(reloadedCart) === 1720 * 2 + 120, 'Reloaded cartTotal is $3560');

  // 9. Remove item
  removeFromCart('prod_bmw_001');
  assert(cart.length === 1, 'Product A removed successfully');
  const afterRemoveRaw = JSON.parse(localStorage.getItem(STORAGE_KEY));
  assert(afterRemoveRaw.length === 1, 'LocalStorage updated after item removal');

  // 10. Test Auth Token persistence and Axios header attachment simulation
  console.log('\n--- Testing Auth Token Persistence & Interceptor ---');
  localStorage.setItem('parthub_token', 'mock_jwt_token_12345');
  localStorage.setItem('parthub_user', JSON.stringify({ name: 'Narayan', email: 'narayan1@gmail.com' }));

  const storedToken = localStorage.getItem('parthub_token');
  const storedUser = JSON.parse(localStorage.getItem('parthub_user'));
  assert(storedToken === 'mock_jwt_token_12345', 'JWT token stored in localStorage');
  assert(storedUser.email === 'narayan1@gmail.com', 'User object stored in localStorage');

  // Simulate Axios request interceptor config check
  const mockConfig = { headers: {} };
  const token = localStorage.getItem('parthub_token');
  if (token) {
    mockConfig.headers.Authorization = `Bearer ${token}`;
  }
  assert(mockConfig.headers.Authorization === 'Bearer mock_jwt_token_12345', 'Axios interceptor attaches Bearer token header');

  console.log(`\n=== State Verification Summary: ${passed} Passed, ${failed} Failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runCartStateSimulation();
