import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// API methods
export const adminAPI = {
  // Login
  login: async (email, password, role) => {
    const response = await api.post('/admin/login', { email, password, role });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // Users
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Courses
  getCourses: async () => {
    const response = await api.get('/admin/courses');
    return response.data;
  },

  addCourse: async (courseData) => {
    const response = await api.post('/admin/courses', courseData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/admin/courses/${id}`);
    return response.data;
  },

  addVideo: async (courseId, videoData) => {
    const response = await api.post(`/admin/courses/${courseId}/videos`, videoData);
    return response.data;
  },

  addQuiz: async (courseId, quizData) => {
    const response = await api.post(`/admin/courses/${courseId}/quizzes`, quizData);
    return response.data;
  },

  // Staff
  getStaff: async () => {
    const response = await api.get('/admin/staff');
    return response.data;
  },

  addStaff: async (staffData) => {
    const response = await api.post('/admin/staff', staffData);
    return response.data;
  },

  updateStaff: async (id, staffData) => {
    const response = await api.put(`/admin/staff/${id}`, staffData);
    return response.data;
  },

  deleteStaff: async (ids) => {
    const response = await api.delete('/admin/staff', { data: { ids } });
    return response.data;
  },
};

export default api;
