import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://coachak-backendend.onrender.com';

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Token refresh state
let isRefreshing = false;
let refreshSubscribers = [];
let refreshPromise = null;
let refreshRetries = 0;
const MAX_REFRESH_RETRIES = 2;

// Public routes (no token needed)
const PUBLIC_ROUTES = [
  '/api/v1/auth/register',
  '/api/v1/auth/login',
  '/api/v1/auth/refresh-token'
];

// Notify subscribers when token is refreshed
const onTokenRefreshed = (newAccessToken, error) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken, error));
  refreshSubscribers = [];
};

// Queue requests during refresh
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Fetch new access token using refresh token
const getRefreshToken = async () => {
  if (refreshPromise) return refreshPromise; // Avoid duplicate calls

  try {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    refreshPromise = axios.post(
      `${BASE_URL}/api/v1/auth/refresh-token`,
      { refreshToken },
      { withCredentials: true }
    );

    const response = await refreshPromise;
    refreshRetries = 0; // Reset retry counter on success
    return response.data;
  } finally {
    refreshPromise = null;
  }
};

// Request interceptor: Attach token to non-public routes
instance.interceptors.request.use(
  (config) => {
    if (PUBLIC_ROUTES.some(route => config.url.includes(route))) {
      return config;
    }

    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh on 401/expired
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isJwtExpired = error.response?.data?.message === 'jwt expired';
    const isUnauthorized = error.response?.status === 401;

    // Skip if not a token error or already retried
    if (!(isJwtExpired || isUnauthorized) || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Queue requests if refresh is in progress
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((newToken, err) => {
          if (err) return reject(err);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(instance(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      // Attempt refresh (with retry limit)
      if (refreshRetries >= MAX_REFRESH_RETRIES) {
        throw new Error('Max refresh attempts reached');
      }

      const { accessToken } = await getRefreshToken();
      refreshRetries++;

      // Update tokens securely
      Cookies.set('accessToken', accessToken, {
        expires: 5 / 24, // 5 hours
        secure: true,
        sameSite: 'strict'
      });

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      onTokenRefreshed(accessToken, null);
      return instance(originalRequest);
    } catch (refreshError) {
      // Notify all queued requests of failure
      onTokenRefreshed(null, refreshError);

      // Clear tokens and redirect to login
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;