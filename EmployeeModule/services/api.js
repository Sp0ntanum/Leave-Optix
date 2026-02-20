import axios from 'axios';
import {
  getMockEmployeeDashboard,
  applyMockLeave,
  getMockLeaveHistory,
  getMockTeamCalendar
} from './mockData';

// Check if we should use mock data (for demo purposes)
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Employee Dashboard API
export const getEmployeeDashboard = async () => {
  if (USE_MOCK_DATA) {
    return await getMockEmployeeDashboard();
  }
  
  try {
    const response = await api.get('/employee/dashboard');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch dashboard data';
    throw new Error(message);
  }
};

// Apply Leave API
export const applyLeave = async (payload) => {
  if (USE_MOCK_DATA) {
    return await applyMockLeave(payload);
  }
  
  try {
    const response = await api.post('/leave/apply', payload);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to apply leave';
    throw new Error(message);
  }
};

// Leave History API
export const getLeaveHistory = async () => {
  if (USE_MOCK_DATA) {
    return await getMockLeaveHistory();
  }
  
  try {
    const response = await api.get('/leave/history');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch leave history';
    throw new Error(message);
  }
};

// Team Calendar API
export const getTeamCalendar = async () => {
  if (USE_MOCK_DATA) {
    return await getMockTeamCalendar();
  }
  
  try {
    const response = await api.get('/employee/team-calendar');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch team calendar';
    throw new Error(message);
  }
};

export default api;
