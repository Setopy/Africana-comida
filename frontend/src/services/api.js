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
  getAll: () => api.get('/menu-simple'),
  getById: (id) => api.get(`/menu-simple/${id}`),
  create: (data) => api.post('/menu-simple', data),
  update: (id, data) => api.put(`/menu-simple/${id}`, data),
  delete: (id) => api.delete(`/menu-simple/${id}`)
};

export default api;
