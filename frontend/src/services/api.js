import axios from 'axios';
import { API_URL } from '../config/constants';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const menuAPI = {
  getAll: () => axios.get('/.netlify/functions/menu-simple'),
  getById: (id) => axios.get(`/.netlify/functions/menu-simple/${id}`),
  create: (data) => axios.post('/.netlify/functions/menu-simple', data),
  update: (id, data) => axios.put(`/.netlify/functions/menu-simple/${id}`, data),
  delete: (id) => axios.delete(`/.netlify/functions/menu-simple/${id}`)
};

export default api;
