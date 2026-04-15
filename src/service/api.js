import axios from 'axios';

const BASE_URL = 'https://okurmenkidstest.up.railway.app';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.detail || error.response?.data?.message || error.message;
        return Promise.reject(new Error(message));
    }
);

export const endpoints = {
    validate: (data) => api.post('/api/v1/sessions/validate', data),
    startAttempt: (data) => api.post('/api/v1/attempt/start', data),
    submitAnswer: (data) => {
        console.log('📤 submitAnswer payload:', data);
        return api.post('/api/v1/attempt/answer', data);
    },
    finish: (data) => api.post('/api/v1/attempt/finish', data),
    getResult: (id) => api.get(`/api/v1/attempt/${id}/result`),
};

export default api;