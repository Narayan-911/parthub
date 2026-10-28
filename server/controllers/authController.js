const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !username || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, username, email, and password');
    }

    // 2. Check if username or email already exists
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    const userExistsByUsername = await User.findOne({ username: normalizedUsername });
    if (userExistsByUsername) {
      res.status(400);
      throw new Error('Username is already taken');
    }

    const userExistsByEmail = await User.findOne({ email: normalizedEmail });
    if (userExistsByEmail) {
      res.status(400);
      throw new Error('Email is already registered');
    }

    // 3. Create user (password hashed in pre-save hook)
    const user = await User.create({
      name: name.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    });

    // 4. Return token and user profile
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Allow login via username or email
    const loginIdentifier = (username || email || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      res.status(400);
      throw new Error('Please provide username/email and password');
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
    });

    if (!user) {
      res.status(401);
      throw new Error('Invalid username or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid username or password');
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is populated by protect middleware
    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
