// import axios from 'axios';

// const API_URL = 'http://localhost:8000';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests if available
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Auth API
// export const authAPI = {
//   signupDoctor: (data) => api.post('/auth/signup/doctor', data),
//   signupPatient: (data) => api.post('/auth/signup/patient', data),
//   signin: (data) => api.post('/auth/signin', data),
// };

// // Doctor API
// export const doctorAPI = {
//   getProfile: () => api.get('/doctor/me'),
//   updateProfile: (data) => api.put('/doctor/me', data),
//   toggleAutoAccept: (autoAccept) => api.patch(`/doctor/me/auto-accept?auto_accept=${autoAccept}`),
//   getDoctorById: (id) => api.get(`/doctor/${id}`),
//   listDoctors: (params) => api.get('/doctor/', { params }),
// };

// // Patient API
// export const patientAPI = {
//   getProfile: () => api.get('/patient/me'),
//   updateProfile: (data) => api.put('/patient/me', data),
//   deleteAccount: () => api.delete('/patient/me'),
// };

// // Entry API
// export const entryAPI = {
//   create: (data) => api.post('/entry/', data),
//   getMyEntries: () => api.get('/entry/my-entries'),
//   getEntry: (id) => api.get(`/entry/${id}`),
// };

// // Report API
// export const reportAPI = {
//   create: (data) => api.post('/report/', data),
//   getForEntry: (entryId) => api.get(`/report/entry/${entryId}`),
//   delete: (id) => api.delete(`/report/${id}`),
// };

// // Analysis API
// export const analysisAPI = {
//   createOrUpdate: (data) => api.post('/analysis/', data),
//   getForEntry: (entryId) => api.get(`/analysis/entry/${entryId}`),
//   delete: (entryId) => api.delete(`/analysis/entry/${entryId}`),
//   runAnalysis: (entryId) => api.post(`/analysis/run/${entryId}`),
// };

// export default api;
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create main axios instance for regular JSON requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create separate instance for multipart/form-data (file uploads)
const apiMultipart = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add token to requests if available for both instances
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(addAuthToken);
apiMultipart.interceptors.request.use(addAuthToken);

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

// Entry API - UPDATED FOR FILE UPLOADS
// Entry API
export const entryAPI = {
  create: (formData) => apiMultipart.post('/entry/', formData, {  // Changed from '/entries/'
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Upload progress: ${percentCompleted}%`);
      return percentCompleted;
    }
  }),
  
  getMyEntries: () => api.get('/entry/my-entries'),  // Changed from '/entries/my-entries'
  getEntry: (id) => api.get(`/entry/${id}`),  // Changed from '/entries/${id}'
  
  cleanupVideos: (entryId) => api.delete(`/entry/cleanup/${entryId}`),
};
// Report API
export const reportAPI = {
  create: (data) => api.post('/report/', data),
  getForEntry: (entryId) => api.get(`/report/entry/${entryId}`),
  delete: (id) => api.delete(`/report/${id}`),
};

// Analysis API
export const analysisAPI = {
  createOrUpdate: (data) => api.post('/analysis/', data),
  getForEntry: (entryId) => api.get(`/analysis/entry/${entryId}`),
  delete: (entryId) => api.delete(`/analysis/entry/${entryId}`),
  runAnalysis: (entryId) => api.post(`/analysis/run/${entryId}`),
};

// Upload helper functions
export const uploadAPI = {
  // Direct upload to Cloudinary (alternative approach)
  getCloudinarySignature: (params) => api.post('/upload/signature', params),
  
  // Presigned URL approach
  getPresignedUrl: (filename, filetype) => 
    api.post('/upload/presigned-url', { filename, filetype }),
};

// Progress tracking utility
export const createProgressTracker = (onProgress) => {
  return {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    }
  };
};

export default api;