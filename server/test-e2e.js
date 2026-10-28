/**
 * PartHub End-to-End (E2E) Workflow Verification
 * Simulates user registration -> login -> catalog browsing -> cart checkout -> MongoDB order verification.
 */

process.env.NODE_ENV = 'test';
process.env.PORT = '5008';

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./server');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function runE2EWorkflow() {
  console.log('\n================================================================');
  console.log('   🏎️  PartHub Full-Stack End-to-End (E2E) Workflow Test');
  console.log('================================================================\n');

  const server = app.listen(5008, async () => {
    const BASE_URL = 'http://localhost:5008';
    let passed = 0;
    let failed = 0;

    const assert = (condition, description, detail) => {
      if (condition) {
        console.log(`[PASS] ${description}`);
        passed++;
        return true;
      } else {
        console.error(`[FAIL] ${description}`, detail || '');
        failed++;
        return false;
      }
    };

    try {
      // 1. Health check
      const resHealth = await fetch(`${BASE_URL}/api/health`);
      const dataHealth = await resHealth.json();
      assert(resHealth.status === 200 && dataHealth.status === 'healthy', '1. Server is booted and healthy (HTTP 200)');

      // 2. Register a new user
      const uniqueId = Date.now();
      const testUserData = {
        name: 'E2E Driver',
        username: `e2edriver_${uniqueId}`,
        email: `driver_${uniqueId}@motorsports.com`,
        password: 'PrecisionPass123!',
      };

      const resRegister = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUserData),
      });
      const dataRegister = await resRegister.json();
      assert(resRegister.status === 201 && dataRegister.data?.token, '2. New user registered successfully (HTTP 201 Created)');
      const userId = dataRegister.data?.id;

      // 3. Log in the newly registered user
      const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: testUserData.username,
          password: testUserData.password,
        }),
      });
      const dataLogin = await resLogin.json();
      const authToken = dataLogin.data?.token;
      assert(resLogin.status === 200 && authToken, '3. Authenticated new user via credentials (HTTP 200 OK)');

      // 4. Verify authenticated profile via /api/auth/me
      const resMe = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const dataMe = await resMe.json();
      assert(resMe.status === 200 && dataMe.data?.username === testUserData.username, '4. JWT Bearer token validated via /api/auth/me (HTTP 200 OK)');

      // 5. Browse Products catalog
      const resProducts = await fetch(`${BASE_URL}/api/products`);
      const dataProducts = await resProducts.json();
      assert(resProducts.status === 200 && Array.isArray(dataProducts.data) && dataProducts.data.length > 0, `5. Browsed catalog: ${dataProducts.data?.length} parts retrieved (HTTP 200 OK)`);

      // Pick two products for cart & checkout
      const product1 = dataProducts.data[0]; // e.g. Starter Motor
      const product2 = dataProducts.data[1]; // e.g. Spark Plug
      const initialStock1 = product1.stock;
      const initialStock2 = product2.stock;

      console.log(`       -> Selected Product 1: "${product1.name}" ($${product1.price}, stock: ${initialStock1})`);
      console.log(`       -> Selected Product 2: "${product2.name}" ($${product2.price}, stock: ${initialStock2})`);

      // 6. Checkout & Place Order
      const expectedTotal = Number((product1.price * 1 + product2.price * 2).toFixed(2));
      const orderPayload = {
        orderItems: [
          { productId: product1._id, quantity: 1 },
          { productId: product2._id, quantity: 2 },
        ],
        shippingAddress: {
          name: 'E2E Driver Test',
          email: testUserData.email,
          address: '777 Turbocharger Lane',
          city: 'Detroit',
          state: 'MI',
          zip: '48201',
        },
        paymentMethod: 'Card (Simulated Sandbox)',
      };

      const resOrder = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(orderPayload),
      });
      const dataOrder = await resOrder.json();
      assert(resOrder.status === 201 && dataOrder.data?._id, `6. Placed order with server-calculated total: $${dataOrder.data?.totalPrice} (HTTP 201 Created)`);
      const createdOrderId = dataOrder.data?._id;

      // 7. Verify Order record in MongoDB database
      const dbOrder = await Order.findById(createdOrderId);
      assert(dbOrder !== null, '7. Order confirmed present in MongoDB database');
      assert(String(dbOrder.user) === String(userId), '8. Order in MongoDB correctly linked to registered User ID');
      assert(dbOrder.orderItems.length === 2, '9. Order in MongoDB contains accurate 2 items array');
      assert(dbOrder.totalPrice === expectedTotal, `10. Order in MongoDB has exact calculated total ($${dbOrder.totalPrice} == $${expectedTotal})`);
      assert(dbOrder.isPaid === true, '11. Order in MongoDB marked as isPaid: true');
      assert(dbOrder.shippingAddress.address === '777 Turbocharger Lane', '12. Order in MongoDB shipping address matches checkout submission');

      // 8. Verify Stock decremented in MongoDB
      const updatedProd1 = await Product.findById(product1._id);
      const updatedProd2 = await Product.findById(product2._id);
      assert(updatedProd1.stock === initialStock1 - 1, `13. Product 1 stock decremented accurately (${initialStock1} -> ${updatedProd1.stock})`);
      assert(updatedProd2.stock === initialStock2 - 2, `14. Product 2 stock decremented accurately (${initialStock2} -> ${updatedProd2.stock})`);

      // 9. Fetch order receipt endpoint
      const resReceipt = await fetch(`${BASE_URL}/api/orders/${createdOrderId}`);
      const dataReceipt = await resReceipt.json();
      assert(resReceipt.status === 200 && dataReceipt.data?._id === createdOrderId, '15. Retrieved order confirmation receipt via /api/orders/:id (HTTP 200 OK)');

      // Cleanup test data
      await Order.findByIdAndDelete(createdOrderId);
      await User.findByIdAndDelete(userId);
      // Restore stock
      await Product.findByIdAndUpdate(product1._id, { stock: initialStock1 });
      await Product.findByIdAndUpdate(product2._id, { stock: initialStock2 });

      console.log('\n================================================================');
      console.log(`   E2E Test Results: ${passed} Passed, ${failed} Failed`);
      console.log('================================================================\n');

    } catch (err) {
      console.error('[E2E Error]:', err);
      failed++;
    } finally {
      server.close(() => {
        process.exit(failed > 0 ? 1 : 0);
      });
    }
  });
}

runE2EWorkflow();
