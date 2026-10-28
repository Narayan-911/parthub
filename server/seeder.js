const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Load environment variables
dotenv.config();

const sampleUser = {
  name: 'Narayan',
  username: 'narayan',
  email: 'narayan1@gmail.com',
  password: '1234',
};

const sampleProducts = [
  {
    name: 'Cv Joint',
    price: 75,
    description: 'Heavy-duty constant velocity joint designed for smooth power transmission and high torque loads.',
    category: 'Drivetrain',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    stock: 25,
  },
  {
    name: 'Air Filter (OEM)',
    price: 40,
    description: 'Original Equipment Manufacturer spec multi-fiber engine air filter providing optimal airflow and debris filtration.',
    category: 'Filters',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    stock: 30,
  },
  {
    name: 'Air Filter (Sport)',
    price: 28,
    description: 'High-flow washable sport performance air filter engineered to boost throttle response and horsepower.',
    category: 'Filters',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    stock: 20,
  },
  {
    name: 'Starter Motor',
    price: 57,
    description: 'High-torque starter motor with heavy-duty solenoid for reliable engine ignition in all weather conditions.',
    category: 'Electrical',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    stock: 15,
  },
  {
    name: 'Camshaft',
    price: 120,
    description: 'Precision-machined billet steel performance camshaft for enhanced valve timing and increased mid-range power.',
    category: 'Engine Parts',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    stock: 12,
  },
  {
    name: 'Rim',
    price: 457,
    description: 'Lightweight forged alloy wheel rim featuring aerodynamic multi-spoke design and satin finish.',
    category: 'Wheels',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    stock: 18,
  },
  {
    name: 'SKF Bearing',
    price: 10,
    description: 'Ultra-precision SKF deep groove ball bearing with synthetic grease lubrication for extended operational life.',
    category: 'Bearings',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    stock: 50,
  },
  {
    name: 'Spark Plug',
    price: 12,
    description: 'Iridium-tipped spark plug offering superior ignitability, improved fuel efficiency, and long service intervals.',
    category: 'Ignition',
    imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
    stock: 100,
  },
  {
    name: 'BMW Full Kit',
    price: 1720,
    description: 'Comprehensive OEM M-Sport suspension, brakes, and aerodynamics overhaul kit for BMW 3/4/5 Series.',
    category: 'Body & Performance Kits',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
    stock: 5,
  },
  {
    name: 'Mustang Full Kit',
    price: 2000,
    description: 'Complete GT performance package including cold air intake, quad exhaust, sport springs, and front splitter.',
    category: 'Body & Performance Kits',
    imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=600&q=80',
    stock: 4,
  },
  {
    name: 'Mercedes Full Kit',
    price: 6599,
    description: 'Flagship AMG aero and handling dynamic package with carbon-fiber accents, active damping, and upgraded calipers.',
    category: 'Body & Performance Kits',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
    stock: 3,
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Existing collections cleared.');

    // Create user (triggers pre-save bcrypt hash)
    const createdUser = await User.create(sampleUser);
    console.log(`[Seeder] Test user created: ${createdUser.username} (${createdUser.email})`);

    // Insert products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`[Seeder] Successfully imported ${createdProducts.length} legacy products!`);

    console.log('[Seeder] Data import complete! ✨');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Import failed: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] All database records successfully destroyed! 🧹');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Destroy failed: ${error.message}`);
    process.exit(1);
  }
};

// Route CLI arguments
if (process.argv[2] === '-d' || process.argv.includes('--destroy')) {
  destroyData();
} else {
  importData();
}
