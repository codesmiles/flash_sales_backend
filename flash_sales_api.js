// Project structure
/**
 * flash-sale-api/
 * ├── config/
 * │   ├── db.js           # Database connection
 * │   └── config.js       # App configuration
 * ├── controllers/
 * │   ├── authController.js      # Authentication logic
 * │   ├── saleController.js      # Flash sale operations
 * │   └── leaderboardController.js # Leaderboard logic
 * ├── middlewares/
 * │   ├── auth.js         # Authentication middleware
 * │   └── errorHandler.js # Central error handling
 * ├── models/
 * │   ├── User.js         # User model
 * │   ├── Product.js      # Product model
 * │   ├── Sale.js         # Flash sale event model
 * │   └── Purchase.js     # Purchase record model
 * ├── routes/
 * │   ├── authRoutes.js   # Authentication routes
 * │   ├── saleRoutes.js   # Sale routes
 * │   └── leaderboardRoutes.js # Leaderboard routes
 * ├── utils/
 * │   └── asyncHandler.js # Async error handling
 * ├── app.js              # Express app initialization
 * ├── server.js           # Server entry point
 * └── package.json        # Dependencies
 */

// 1. Initialize your project
// package.json
{
  "name": "flash-sale-api",
  "version": "1.0.0",
  "description": "A robust API for flash sale events",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.0",
    "helmet": "^7.0.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^7.5.3",
    "morgan": "^1.10.0",
    "validator": "^13.11.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.0.1"
  }
}

// 2. Environment setup
// .env (don't commit this to version control)
PORT=3000
MONGODB_URI=mongodb://localhost:27017/flash-sale-db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=90d

// 3. Database connection
// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

// 4. Configuration
// config/config.js
module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN
};

// 5. Models
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  purchases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password encryption middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password verification method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

// models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'A sale must be associated with a product']
  },
  initialStock: {
    type: Number,
    required: [true, 'Please specify the initial stock'],
    default: 200
  },
  currentStock: {
    type: Number,
    required: [true, 'Current stock must be specified'],
    validate: {
      validator: function(val) {
        return val >= 0;
      },
      message: 'Current stock cannot be negative'
    }
  },
  startTime: {
    type: Date,
    required: [true, 'Start time must be specified']
  },
  endTime: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: false
  },
  limitPerUser: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual property for remaining duration
saleSchema.virtual('remainingTime').get(function() {
  if (!this.isActive) return 0;
  if (this.currentStock <= 0) return 0;
  
  const now = new Date();
  return Math.max(0, this.endTime - now);
});

// Method to check if a sale is currently active
saleSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return (
    this.isActive && 
    now >= this.startTime && 
    (this.endTime === null || now <= this.endTime) && 
    this.currentStock > 0
  );
};

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;

// models/Purchase.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A purchase must be associated with a user']
  },
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    required: [true, 'A purchase must be associated with a sale']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'A purchase must be associated with a product']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  purchaseTime: {
    type: Date,
    default: Date.now
  }
});

// Index for faster leaderboard queries
purchaseSchema.index({ sale: 1, purchaseTime: 1 });

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;

// 6. Middleware
// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const config = require('../config/config');

const protect = async (req, res, next) => {
  try {
    // 1) Check if token exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in! Please log in to get access'
      });
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, config.jwtSecret);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists'
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token or authorization failed'
    });
  }
};

module.exports = { protect };

// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } 
  // Production error response
  else {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or unknown error
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

module.exports = errorHandler;

// 7. Controllers
// utils/asyncHandler.js
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config/config');

// Generate JWT token
const signToken = id => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

// Send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Signup user
exports.signup = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  createSendToken(newUser, 201, res);
});

// Login user
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide email and password'
    });
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: 'error',
      message: 'Incorrect email or password'
    });
  }

  // 3) If everything is OK, send token
  createSendToken(user, 200, res);
});

// controllers/saleController.js
const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Create a new flash sale
exports.createSale = asyncHandler(async (req, res) => {
  const { productId, initialStock, startTime, endTime, limitPerUser } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }

  const sale = await Sale.create({
    product: productId,
    initialStock: initialStock || 200,
    currentStock: initialStock || 200,
    startTime,
    endTime,
    limitPerUser: limitPerUser || 1,
    isActive: false // Sale is created but not active by default
  });

  res.status(201).json({
    status: 'success',
    data: {
      sale
    }
  });
});

// Activate a flash sale
exports.activateSale = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const sale = await Sale.findById(id);
  if (!sale) {
    return res.status(404).json({
      status: 'error',
      message: 'Sale not found'
    });
  }

  sale.isActive = true;
  sale.startTime = new Date();
  await sale.save();

  res.status(200).json({
    status: 'success',
    data: {
      sale
    }
  });
});

// Get current sale status
exports.getSaleStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const sale = await Sale.findById(id).populate('product');
    if (!sale) {
        return res.status(404).json({
            status: 'error',
            message: 'Sale not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            sale: {
                id: sale._id,
                product: sale.product,
                initialStock: sale.initialStock,
                current: sale.currentStock,
                isActive: sale.isActive,
                startTime: sale.startTime,
                endTime: sale.endTime,
                limitPerUser: sale.limitPerUser
            }
        }
    })
});

        