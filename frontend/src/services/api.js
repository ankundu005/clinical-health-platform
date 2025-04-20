import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service object
const api = {
  // Patient endpoints
  patients: {
    getAll: () => apiClient.get('/patients'),
    getById: (id) => apiClient.get(`/patients/${id}`),
    create: (data) => apiClient.post('/patients', data),
    update: (id, data) => apiClient.patch(`/patients/${id}`, data),
    delete: (id) => apiClient.delete(`/patients/${id}`),
  },
  
  // Assessment endpoints
  assessments: {
    getAll: () => apiClient.get('/assessments'),
    getById: (id) => apiClient.get(`/assessments/${id}`),
    getByPatientId: (patientId) => apiClient.get(`/assessments/patient/${patientId}`),
    create: (data) => apiClient.post('/assessments', data),
    update: (id, data) => apiClient.patch(`/assessments/${id}`, data),
    delete: (id) => apiClient.delete(`/assessments/${id}`),
  },
  
  // Treatment endpoints
  treatments: {
    getAll: () => apiClient.get('/treatments'),
    getById: (id) => apiClient.get(`/treatments/${id}`),
    getByPatientId: (patientId) => apiClient.get(`/treatments/patient/${patientId}`),
    create: (data) => apiClient.post('/treatments', data),
    update: (id, data) => apiClient.patch(`/treatments/${id}`, data),
    delete: (id) => apiClient.delete(`/treatments/${id}`),
  },
  
  // Health check endpoint
  health: {
    check: () => apiClient.get('/health'),
  },
};

export default api;
