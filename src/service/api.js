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
        return api.post('/api/v1/attempt/answer', data);
    },
    finish: (data) => api.post('/api/v1/attempt/finish', data),
    getResult: (id) => api.get(`/api/v1/attempt/${id}/result`),
    sessions: () => api.get('/api/v1/sessions/'),
    tests: (level) => api.get(`/api/v1/tests/${level ? `?level=${level}` : ''}`),
    testsID: (id) => api.get(`/api/v1/tests/${id}/`),

    leaderboard: () => api.get("/api/v2/leaderboard"),
    leaderboardId: (id) => api.get(`/api/v2/sessions/${id}/leaderboard`),
    resultTable: (session_id) => api.get(`/api/v2/sessions/${session_id}/results-table`),
};

export default api;