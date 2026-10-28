const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const partRoutes = require('./routes/partRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// 1. Load environment configuration
dotenv.config();

// 2. Initialize Database Connection
connectDB();

const app = express();

// 3. Global Middleware Setup
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 4. API & Health Check Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'PartHub API Server',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Mount modular REST routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/parts', partRoutes);

// 5. Production Static Assets & SPA Routing
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Welcome to the PartHub Automotive API',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        products: '/api/products',
        orders: '/api/orders',
        parts: '/api/parts',
      },
    });
  });
}

// 6. Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// 7. Server Initialization
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[PartHub Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
