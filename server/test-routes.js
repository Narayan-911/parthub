const http = require('http');
process.env.NODE_ENV = 'test';
process.env.PORT = '5005';

const app = require('./server');
const Product = require('./models/Product');
const User = require('./models/User');

async function runIntegrationTests() {
  console.log('\n=== Starting PartHub REST API Integration Tests ===\n');

  const server = app.listen(5005, async () => {
    const BASE_URL = 'http://localhost:5005';
    let passed = 0;
    let failed = 0;

    const assertStatus = (testName, res, expectedStatus, data) => {
      if (res.status === expectedStatus) {
        console.log(`[PASS] (${res.status}) ${testName}`);
        passed++;
        return true;
      } else {
        console.error(`[FAIL] (${res.status} != ${expectedStatus}) ${testName}`, data);
        failed++;
        return false;
      }
    };

    try {
      // 1. GET /api/products -> 200
      const resProducts = await fetch(`${BASE_URL}/api/products`);
      const dataProducts = await resProducts.json();
      assertStatus('GET /api/products', resProducts, 200, dataProducts);

      const sampleProduct = dataProducts.data && dataProducts.data[0];
      if (!sampleProduct) {
        throw new Error('No products found in DB. Run npm run data:import first.');
      }

      // 2. GET /api/products?search=Camshaft -> 200
      const resSearch = await fetch(`${BASE_URL}/api/products?search=Camshaft`);
      const dataSearch = await resSearch.json();
      assertStatus('GET /api/products?search=Camshaft (filtered)', resSearch, 200, dataSearch);

      // 3. GET /api/products/:id -> 200
      const resSingleProd = await fetch(`${BASE_URL}/api/products/${sampleProduct._id}`);
      const dataSingleProd = await resSingleProd.json();
      assertStatus(`GET /api/products/${sampleProduct._id}`, resSingleProd, 200, dataSingleProd);

      // 4. POST /api/auth/register (New User) -> 201
      const uniqueSuffix = Date.now();
      const newUserData = {
        name: 'Auto Tester',
        username: `tester_${uniqueSuffix}`,
        email: `tester_${uniqueSuffix}@example.com`,
        password: 'securePassword123!',
      };
      const resRegister = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      });
      const dataRegister = await resRegister.json();
      assertStatus('POST /api/auth/register (Success)', resRegister, 201, dataRegister);
      const registeredToken = dataRegister.data?.token;

      // 5. POST /api/auth/register (Duplicate Username/Email) -> 400
      const resDupRegister = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      });
      const dataDupRegister = await resDupRegister.json();
      assertStatus('POST /api/auth/register (Duplicate conflict -> 400)', resDupRegister, 400, dataDupRegister);

      // 6. POST /api/auth/login (Success with test user narayan) -> 200
      const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'narayan', password: '1234' }),
      });
      const dataLogin = await resLogin.json();
      assertStatus('POST /api/auth/login (Valid credentials -> 200)', resLogin, 200, dataLogin);
      const narayanToken = dataLogin.data?.token;

      // 7. POST /api/auth/login (Invalid Password) -> 401
      const resBadLogin = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'narayan', password: 'wrong_password' }),
      });
      const dataBadLogin = await resBadLogin.json();
      assertStatus('POST /api/auth/login (Invalid password -> 401)', resBadLogin, 401, dataBadLogin);

      // 8. GET /api/auth/me (No token -> 401)
      const resMeUnauth = await fetch(`${BASE_URL}/api/auth/me`);
      const dataMeUnauth = await resMeUnauth.json();
      assertStatus('GET /api/auth/me (No token -> 401)', resMeUnauth, 401, dataMeUnauth);

      // 9. GET /api/auth/me (With valid Bearer token -> 200)
      const resMeAuth = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${narayanToken}` },
      });
      const dataMeAuth = await resMeAuth.json();
      assertStatus('GET /api/auth/me (With Bearer token -> 200)', resMeAuth, 200, dataMeAuth);

      // 10. POST /api/orders (Invalid: Missing address -> 400)
      const resBadOrder = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderItems: [{ productId: sampleProduct._id, quantity: 1 }],
          shippingAddress: {}, // Incomplete
        }),
      });
      const dataBadOrder = await resBadOrder.json();
      assertStatus('POST /api/orders (Missing shipping info -> 400)', resBadOrder, 400, dataBadOrder);

      // 11. POST /api/orders (Valid order -> 201)
      const resOrder = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${narayanToken}`,
        },
        body: JSON.stringify({
          orderItems: [
            { productId: sampleProduct._id, quantity: 2 },
          ],
          shippingAddress: {
            name: 'Narayan Test',
            email: 'narayan1@gmail.com',
            address: '123 Turbo Way',
            city: 'Motor City',
            state: 'MI',
            zip: '48201',
          },
          paymentMethod: 'Card (Simulated)',
        }),
      });
      const dataOrder = await resOrder.json();
      assertStatus('POST /api/orders (Valid order creation -> 201)', resOrder, 201, dataOrder);
      const createdOrderId = dataOrder.data?._id;

      // Verify server calculated price correctly
      if (dataOrder.data) {
        console.log(`       -> Server-calculated Total: $${dataOrder.data.totalPrice} (Item: ${sampleProduct.name} x2 @ $${sampleProduct.price})`);
      }

      // 12. GET /api/orders/:id -> 200
      const resGetOrder = await fetch(`${BASE_URL}/api/orders/${createdOrderId}`);
      const dataGetOrder = await resGetOrder.json();
      assertStatus(`GET /api/orders/${createdOrderId} (Order receipt -> 200)`, resGetOrder, 200, dataGetOrder);

      // Clean up test user
      await User.deleteOne({ username: newUserData.username });

      console.log(`\n=== Integration Test Summary: ${passed} Passed, ${failed} Failed ===\n`);
    } catch (err) {
      console.error('\n[Error running integration tests]:', err);
      failed++;
    } finally {
      server.close(() => {
        process.exit(failed > 0 ? 1 : 0);
      });
    }
  });
}

runIntegrationTests();
