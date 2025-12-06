import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signupDoctor: (data) => api.post('/auth/signup/doctor', data),
  signupPatient: (data) => api.post('/auth/signup/patient', data),
  signin: (data) => api.post('/auth/signin', data),
};

// Doctor API
export const doctorAPI = {
  getProfile: () => api.get('/doctor/me'),
  updateProfile: (data) => api.put('/doctor/me', data),
  toggleAutoAccept: (autoAccept) => api.patch(`/doctor/me/auto-accept?auto_accept=${autoAccept}`),
  getDoctorById: (id) => api.get(`/doctor/${id}`),
  listDoctors: (params) => api.get('/doctor/', { params }),
};

// Patient API
export const patientAPI = {
  getProfile: () => api.get('/patient/me'),
  updateProfile: (data) => api.put('/patient/me', data),
  deleteAccount: () => api.delete('/patient/me'),
};

export default api;
