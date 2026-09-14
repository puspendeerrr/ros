import axios from 'axios';
import { useAuthStore } from '../store/auth.store.js';
import { useNetworkStore } from '../store/network.store.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  timeout: 20000, // 20s request timeout for Render cold starts
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Reset network store to online on successful response
    useNetworkStore.getState().resetStatus();
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const { setBackendStatus } = useNetworkStore.getState();

    // Diagnose network/server issues
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
        setBackendStatus({ isBackendOnline: false, isTimeout: true, isServerError: false, isAuthExpired: false });
      } else {
        setBackendStatus({ isBackendOnline: false, isTimeout: false, isServerError: false, isAuthExpired: false });
      }
    } else {
      const status = error.response.status;
      if (status >= 500) {
        setBackendStatus({ isBackendOnline: false, isTimeout: false, isServerError: true, isAuthExpired: false });
      } else if (status === 401) {
        // We set auth expired but wait to see if refresh succeeds
        setBackendStatus({ isBackendOnline: true, isAuthExpired: true });
      } else {
        setBackendStatus({ isBackendOnline: true });
      }
    }

    // Check if error is 401 and request was not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/refresh-token' || originalRequest.url === '/login') {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/refresh-token`,
          {},
          { withCredentials: true, timeout: 20000 }
        );
        const { accessToken } = response.data.data;
        
        useAuthStore.getState().setAccessToken(accessToken);
        
        // Success: clear auth expired flag
        setBackendStatus({ isBackendOnline: true, isAuthExpired: false });
        
        processQueue(null, accessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

