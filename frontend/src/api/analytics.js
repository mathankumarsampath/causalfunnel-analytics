import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export const getSessions = async () => {
  const response = await api.get('/api/sessions');
  return response.data;
};

export const getSessionDetail = async (sessionId) => {
  const response = await api.get(`/api/sessions/${sessionId}`);
  return response.data;
};

export const getHeatmap = async (pageUrl) => {
  const response = await api.get(`/api/heatmap?page=${encodeURIComponent(pageUrl)}`);
  return response.data;
};

export default api;
