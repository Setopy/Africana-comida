/**
 * Application constants and configuration
 */

// API URL configuration
export const getApiUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl) return envApiUrl;
  
  // If running in production and no API URL provided, use Netlify Functions
  if (import.meta.env.PROD) {
    return '/.netlify/functions';  // Netlify Functions endpoint
  }
  
  // Fallback for development - can point to local functions or backend
  return import.meta.env.VITE_USE_FUNCTIONS === 'true' 
    ? '/.netlify/functions'  // Use local Netlify Functions in dev
    : 'http://localhost:5000/api';  // Use Express backend in dev
};

export const API_URL = getApiUrl();

// Menu categories
export const CATEGORIES = [
  { id: 'starters', name: 'Starters' },
  { id: 'main', name: 'Main Dishes' },
  { id: 'soups', name: 'Traditional Soups' },
  { id: 'sides', name: 'Side Dishes' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'specials', name: 'Specials' }
];

// African countries represented in the menu
export const COUNTRIES = [
  { id: 'nigeria', name: 'Nigeria' },
  { id: 'ethiopia', name: 'Ethiopia' },
  { id: 'morocco', name: 'Morocco' },
  { id: 'senegal', name: 'Senegal' },
  { id: 'ghana', name: 'Ghana' },
  { id: 'southafrica', name: 'South Africa' },
  { id: 'kenya', name: 'Kenya' },
  { id: 'cameroon', name: 'Cameroon' }
];

// Order statuses with display colors and text
export const ORDER_STATUS = {
  'pending': { color: 'yellow', text: 'Pending' },
  'confirmed': { color: 'blue', text: 'Confirmed' },
  'preparing': { color: 'orange', text: 'Preparing' },
  'ready': { color: 'indigo', text: 'Ready' },
  'delivering': { color: 'purple', text: 'On the way' },
  'delivered': { color: 'green', text: 'Delivered' },
  'cancelled': { color: 'red', text: 'Cancelled' }
};

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash on Delivery' },
  { id: 'card', name: 'Credit/Debit Card' },
  { id: 'mobile', name: 'Mobile Payment' }
];

// Spicy levels
export const SPICY_LEVELS = [
  { level: 0, name: 'Not Spicy' },
  { level: 1, name: 'Mild' },
  { level: 2, name: 'Medium' },
  { level: 3, name: 'Hot' },
  { level: 4, name: 'Very Hot' },
  { level: 5, name: 'Extremely Hot' }
];

// Image placeholder
export const DEFAULT_IMAGE = 'https://via.placeholder.com/300x200?text=Image+Not+Available';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12;

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date with time
export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};