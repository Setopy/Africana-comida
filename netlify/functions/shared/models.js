const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MenuItem Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  ingredients: [String],
  allergens: [String],
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  image: String
}, { timestamps: true });

// User Schema
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'staff'],
    default: 'customer',
    index: true
  },
  addresses: [addressSchema],
  phone: { type: String },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  preferences: {
    spicyLevel: { type: Number, min: 0, max: 5, default: 0 },
    favoriteCategories: [String],
    dietaryRestrictions: [String],
    allergies: [String]
  },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  active: { type: Boolean, default: true, index: true }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Order Schema  
const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'mobile'],
    required: true 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentDetails: {
    transactionId: { type: String },
    paymentDate: { type: Date }
  },
  deliveryInstructions: { type: String },
  estimatedDelivery: { type: Date },
  actualDelivery: { type: Date },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true });

// Review Schema
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5, index: true },
  comment: { type: String, required: true },
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', index: true },
  approved: { type: Boolean, default: false, index: true },
  reply: { type: String },
  repliedAt: { type: Date },
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  flagged: { type: Boolean, default: false },
  flagReason: { type: String }
}, { timestamps: true });

// RefreshToken Schema
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  expires: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  created: {
    type: Date,
    default: Date.now
  },
  createdByIp: {
    type: String
  },
  revoked: {
    type: Date
  },
  revokedByIp: {
    type: String
  },
  replacedByToken: {
    type: String
  }
}, { timestamps: true });

// Check if models exist before creating them
const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
const RefreshToken = mongoose.models.RefreshToken || mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = {
  MenuItem,
  User,
  Order,
  Review,
  RefreshToken
};