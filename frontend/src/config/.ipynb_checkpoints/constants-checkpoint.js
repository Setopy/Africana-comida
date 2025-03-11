export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const CATEGORIES = [
  { id: 'starters', name: 'Starters' },
  { id: 'main', name: 'Main Dishes' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'specials', name: 'Specials' }
];

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

export const ORDER_STATUS = {
  'pending': { color: 'yellow', text: 'Pending' },
  'confirmed': { color: 'blue', text: 'Confirmed' },
  'preparing': { color: 'orange', text: 'Preparing' },
  'ready': { color: 'indigo', text: 'Ready' },
  'delivering': { color: 'purple', text: 'On the way' },
  'delivered': { color: 'green', text: 'Delivered' },
  'cancelled': { color: 'red', text: 'Cancelled' }
};