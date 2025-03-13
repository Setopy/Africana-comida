const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['starters', 'main', 'desserts', 'drinks', 'specials', 'soups', 'sides'],
    index: true
  },
  featured: { type: Boolean, default: false, index: true },
  ingredients: [String],
  spicyLevel: { type: Number, min: 0, max: 5, default: 0 },
  country: { 
    type: String, 
    required: true, 
    index: true,
    enum: ['nigeria', 'ethiopia', 'morocco', 'senegal', 'ghana', 'southafrica', 'kenya', 'cameroon']
  },
  prepTime: { type: Number }, // in minutes
  isAvailable: { type: Boolean, default: true, index: true },
  nutritionalInfo: {
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number }
  },
  allergens: [String]
}, { timestamps: true });

// Create compound indexes for common query patterns
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ featured: 1, isAvailable: 1 });
menuItemSchema.index({ country: 1, isAvailable: 1 });
menuItemSchema.index({ spicyLevel: 1, isAvailable: 1 });

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Add pre-save hook for validation
menuItemSchema.pre('save', function(next) {
  // Ensure ingredients are unique and trimmed
  if (this.ingredients && this.ingredients.length) {
    this.ingredients = [...new Set(this.ingredients.map(item => item.trim()))];
  }
  
  // Ensure allergens are unique and trimmed
  if (this.allergens && this.allergens.length) {
    this.allergens = [...new Set(this.allergens.map(item => item.trim()))];
  }
  
  next();
});

module.exports = mongoose.model('MenuItem', menuItemSchema);