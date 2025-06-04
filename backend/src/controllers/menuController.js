const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');

exports.getAllItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
