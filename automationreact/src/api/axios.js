import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.213.230:8000',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
