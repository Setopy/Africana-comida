const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Method to get user's default address
userSchema.methods.getDefaultAddress = function() {
  if (!this.addresses || this.addresses.length === 0) return null;
  
  const defaultAddress = this.addresses.find(addr => addr.isDefault);
  return defaultAddress || this.addresses[0]; // Return default or first address
};

// Method to add a new address
userSchema.methods.addAddress = function(addressData) {
  // If this is the first address or marked as default, ensure it's set as default
  if (this.addresses.length === 0 || addressData.isDefault) {
    // If this is set as default, unset any existing default
    if (addressData.isDefault) {
      this.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // If this is the first address, make it default regardless
    if (this.addresses.length === 0) {
      addressData.isDefault = true;
    }
  }
  
  this.addresses.push(addressData);
  return this;
};

// Virtual for full address
userSchema.virtual('defaultAddressFormatted').get(function() {
  const defaultAddress = this.getDefaultAddress();
  if (!defaultAddress) return '';
  
  return `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.postalCode}`;
});

module.exports = mongoose.model('User', userSchema);