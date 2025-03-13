const mongoose = require('mongoose');

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

// Create compound indexes for common query patterns
orderSchema.index({ 'customer.email': 1, status: 1 });
orderSchema.index({ createdAt: -1 }); // For sorting by date descending
orderSchema.index({ status: 1, createdAt: -1 }); // For filtering by status and sorting
orderSchema.index({ paymentStatus: 1, status: 1 }); // For payment reporting

// Virtual for item count
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for subtotal (before tax, delivery fee, etc.)
orderSchema.virtual('subtotal').get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// Methods
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.subtotal;
  return subtotal + this.tax + this.deliveryFee - this.discount;
};

// Pre-save hook to calculate total
orderSchema.pre('save', function(next) {
  if (this.isModified('items') || this.isModified('tax') || 
      this.isModified('deliveryFee') || this.isModified('discount')) {
    this.totalAmount = this.calculateTotal();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);