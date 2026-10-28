# PartHub 🏎️

> Production-Ready MERN Architecture for the PartHub Automotive E-Commerce Platform.

## Directory Structure

```text
parthub/
├── client/                     # Frontend SPA (React + Vite)
│   ├── src/
│   │   ├── App.jsx             # Root application component with health check
│   │   ├── main.jsx            # React DOM render entry
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend API (Node.js + Express + Mongoose)
│   ├── config/
│   │   └── db.js               # MongoDB connection using Mongoose
│   ├── controllers/
│   │   └── partController.js   # Automotive parts controller handlers
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT authentication & route protection
│   │   └── errorMiddleware.js  # 404 & centralized error handlers
│   ├── models/
│   │   └── Part.js             # Mongoose Automotive Part Schema
│   ├── routes/
│   │   └── partRoutes.js       # Express Router for /api/parts
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── server.js               # Express entry point
├── package.json                # Root orchestration & scripts
└── .gitignore
```

---

## Getting Started

### 1. Install Dependencies
To install all dependencies across the monorepo:
```bash
npm run install:all
```

### 2. Configure Environment Variables
Inside `server/`, verify or create `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/parthub
JWT_SECRET=parthub_jwt_secret_dev_key_replace_in_prod
CLIENT_URL=http://localhost:5173
```

### 3. Run Applications
- **Start both Client & Server concurrently:**
  ```bash
  npm run dev
  ```
- **Start Server only (with nodemon hot-reload):**
  ```bash
  npm run server
  ```
- **Start Client only (Vite dev server):**
  ```bash
  npm run client
  ```

---

## Database & Seeding

### Available Models
- **[`server/models/User.js`](file:///C:/Users/Shree/.gemini/antigravity/scratch/parthub/server/models/User.js)**: User schema with automatic `bcryptjs` pre-save hashing (salt rounds 10) and `matchPassword()` verification method.
- **[`server/models/Product.js`](file:///C:/Users/Shree/.gemini/antigravity/scratch/parthub/server/models/Product.js)**: Automotive catalog products with name, price, description, category, stock, and placeholder imagery.
- **[`server/models/Order.js`](file:///C:/Users/Shree/.gemini/antigravity/scratch/parthub/server/models/Order.js)**: Modernized schema replacing the legacy `billinfo` table with shipping, line items, and payment simulation.

### Seeding Commands
Seed the 11 legacy automotive catalog parts and the default test user:
```bash
# Seed initial data
npm run data:import

# Wipe database
npm run data:destroy
```

### Default Credentials
- **Username:** `narayan`
- **Email:** `narayan1@gmail.com`
- **Password:** `1234`

---

## REST API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user (`name`, `username`, `email`, `password`) -> Returns `201` + JWT
- `POST /api/auth/login` - Authenticate (`username`/`email`, `password`) -> Returns `200` + JWT
- `GET /api/auth/me` - Current user profile (Requires `Authorization: Bearer <token>`) -> Returns `200` / `401`

### 🏎️ Products (`/api/products`)
- `GET /api/products` - Fetch all automotive parts with optional `?search=` and `?category=` query params -> Returns `200`
- `GET /api/products/:id` - Fetch single product by ID -> Returns `200` / `404`

### 📦 Orders (`/api/orders`)
- `POST /api/orders` - Submit order with server-side pricing, inventory validation, and shipping address -> Returns `201` / `400`
- `GET /api/orders/:id` - Retrieve order receipt details by ID -> Returns `200` / `404`

---

## Automated Route Testing
Run the comprehensive integration test suite verifying status codes (`200`, `201`, `400`, `401`):
```bash
npm run test:routes --prefix server
```

---

## 💻 Frontend Client Architecture

- **Dark Automotive Aesthetic:** Pure black `#000000` sticky navbar with red accent styling (`#e53e3e`), dynamic badge counters, and responsive hamburger drawer.
- **Routing (`react-router-dom`):**
  - `/` - Home Showcase with motorsport hero banner, feature value props, and featured parts.
  - `/products` - Catalog browser with live text search and multi-category filter pills.
  - `/about` - Motorsport engineering mission and vehicle specialist support.
  - `/cart` - Shopping cart with live quantity adjustment, item removal, and subtotal calculation.
  - `/checkout` - Address validation, simulated payment processing, and backend order submission.
  - `/order-success/:id` - Order confirmation receipt with reference ID, shipping destination, and line items.
  - `/login` & `/register` - Dark cards with form validation, quick demo fill button (`narayan` / `1234`), and JWT session persistence.
- **Structured Multi-Column Footer:**
  - Newsletter subscription banner with confirmation feedback.
  - 4 Responsive columns: Performance Kits (BMW, Mustang, Mercedes), Quick Links, Contact Details, and Company Info.
  - Vector social links row and copyright footer.
- **Global Toast Notification System (`ToastContext.jsx`):**
  - Instant visual feedback on cart operations, authentication, quantity adjustments, and API network errors.
- **Legacy Template Alignment:**
  - `AboutPage.jsx` mirrors `about_us.php` with alternating split sections (Our Vision, Extensive Selection, Customer Satisfaction) and community callout banner.
  - `CheckoutPage.jsx` mirrors `checkout.php` with shipping addresses and simulated card inputs (Card Number, Expiration Month/Year, CVV).
  - `CartPage.jsx` renders a structured tabular view with live item totals and empty state vehicle illustration.

---

## 🧠 Global State Management & Persistence

### 1. `AuthContext.jsx`
- Manages `user`, `token`, `isAuthenticated`, and `loading` states.
- Persists credentials to `localStorage` (`parthub_user`, `parthub_token`).
- Provides asynchronous `login(emailOrUsername, password)`, `register(formData)`, and `logout()` methods.
- Automatically initializes session via `GET /api/auth/me` on mount.

### 2. `CartContext.jsx`
- Stores items strictly formatted as: `[{ product: { _id, name, price, imageUrl, ... }, quantity: Number }]`.
- Persists cart items to `localStorage` (`parthub_cart_items`) surviving page reloads and browser sessions.
- Provides helper methods:
  - `addToCart(product, quantity)`: Appends or increments quantity in-place.
  - `removeFromCart(productId)`: Deletes item by product ID.
  - `updateQuantity(productId, quantity)`: Directly updates quantity (enforced minimum: 1).
  - `clearCart()`: Wipes items upon order submission.
  - `cartTotal`: Computed real-time order subtotal.
  - `cartCount`: Computed total item counter for navbar badge.

### 3. Axios Interceptor (`services/api.js`)
- Pre-configured client targeting `http://localhost:5000/api`.
- Request interceptor automatically attaches `Authorization: Bearer <token>` when a token exists in `localStorage`.

### Run State Tests
Verify state actions, schema compliance, and reload persistence:
```bash
npm run test:state
```

---

## 🧪 Comprehensive Verification Suites

PartHub includes three automated test suites ensuring zero-regression reliability:

1. **REST API Route Tests (12/12 Passing):**
   ```bash
   npm run test:routes
   ```
   Validates HTTP `200`, `201`, `400`, `401`, and `404` status codes across Auth, Products, and Orders endpoints.

2. **Frontend State & LocalStorage Tests (30/30 Passing):**
   ```bash
   npm run test:state
   ```
   Validates schema compliance `[{ product, quantity }]`, quantity limits, subtotal math, and simulated page reload rehydration.

3. **Full-Stack End-to-End Workflow Tests (15/15 Passing):**
   ```bash
   npm run test:e2e
   ```
   Simulates: Registering new driver &rarr; Authenticating &rarr; Fetching catalog &rarr; Placing order with multiple parts &rarr; Verifying order linkage and pricing math in MongoDB &rarr; Checking inventory decrements.

---

## 🐳 Docker Containerization

To run the entire ecosystem (MongoDB, Node.js Express server, and Nginx-powered React client) via Docker:

```bash
# Build and launch all services in detached mode
docker compose up --build -d

# Check running container logs
docker compose logs -f

# Teardown containers and networks
docker compose down
```

- **Frontend Application:** `http://localhost` (Port 80)
- **Backend API:** `http://localhost:5000` (Port 5000)
- **MongoDB:** `localhost:27017` (Port 27017)

---

## 🚀 Production Deployment (Single-Port Node.js)

The Express server serves optimized static assets and handles SPA fallback routing directly from `client/dist`:

```bash
# 1. Build the production React bundle
npm run build

# 2. Run the production server
NODE_ENV=production npm start
```

---

## Verified Status
- **Backend Port:** `http://localhost:5000`
- **Health Check Endpoint:** `GET /api/health`
- **Frontend Dev Server:** `http://localhost:5173`
- **Frontend Production Build:** Built with Vite in 921ms (0 errors)
- **REST Integration Tests:** 12 Passed (0 Failed)
- **State & Persistence Tests:** 30 Passed (0 Failed)
- **End-to-End (E2E) Tests:** 15 Passed (0 Failed)
- **MongoDB Status:** Connected & seeded with 11 products + 1 test user

#   p a r t h u b  
 