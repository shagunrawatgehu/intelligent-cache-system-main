import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg = error.response?.data?.message || error.message || 'Network error occurred';
    console.error('[API Error]', errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

export const healthService = {
  checkHealth: () => api.get('/health')
};

export const simulationService = {
  runSimulation: (payload) => api.post('/simulations/run', payload),
  getHistory: (params) => api.get('/simulations', { params }),
  getDetails: (id) => api.get(`/simulations/${id}`),
  deleteSimulation: (id) => api.delete(`/simulations/${id}`)
};

export default api;