const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['starters', 'main', 'desserts', 'drinks', 'specials'] 
  },
  featured: { type: Boolean, default: false },
  ingredients: [String],
  spicyLevel: { type: Number, min: 0, max: 5, default: 0 },
  country: { type: String, required: true },
  prepTime: { type: Number }, // in minutes
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
