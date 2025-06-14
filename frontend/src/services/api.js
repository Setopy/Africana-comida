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
  getAll: () => axios.get('/.netlify/functions/hello'),
  getById: (id) => axios.get(`/.netlify/functions/hello/${id}`),
  create: (data) => axios.post('/.netlify/functions/hello', data),
  update: (id, data) => axios.put(`/.netlify/functions/hello/${id}`, data),
  delete: (id) => axios.delete(`/.netlify/functions/hello/${id}`)
};

export default api;
