import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://coachak-backendend.onrender.com';

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
<<<<<<< HEAD
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
=======
});

let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

>>>>>>> 9eef924d051b62204fab6f3200e78c906dd27d30
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

<<<<<<< HEAD
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
=======
const getRefreshToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios.post(`${BASE_URL}/api/v1/auth/refresh-token`, { 
      refreshToken 
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    // Clear tokens if refresh fails
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    throw error;
  }
};

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Skip auth for these routes
    const authRoutes = [
      "/api/v1/auth/register",
      "/api/v1/auth/login",
      "/api/v1/auth/refresh-token"
    ];
    
    if (authRoutes.some(route => config.url.includes(route))) {
      return config;
    }

    const token = Cookies.get("accessToken");
>>>>>>> 9eef924d051b62204fab6f3200e78c906dd27d30
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

<<<<<<< HEAD
// Response interceptor: Handle token refresh on 401/expired
=======
// Response interceptor
>>>>>>> 9eef924d051b62204fab6f3200e78c906dd27d30
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
<<<<<<< HEAD
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
=======
    
    // Check if error is due to expired JWT
    const isJwtExpired = error.response?.data?.message === 'jwt expired';
    const isUnauthorized = error.response?.status === 401;
    
    // Only handle if it's an expired JWT or 401 error
    if ((isJwtExpired || isUnauthorized) && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If we're already refreshing, wait for the new token
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(instance(originalRequest));
          });
        });
      }
      
      isRefreshing = true;
      
      try {
        // Attempt to refresh the token
        const { accessToken } = await getRefreshToken();
        
        // Store the new token
        Cookies.set('accessToken', accessToken, { expires: 5/24 });
        
        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Notify all waiting requests
        onTokenRefreshed(accessToken);
        
        // Retry the original request
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        
        // Clear tokens and redirect to login
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // For other errors, just reject
    return Promise.reject(error);
>>>>>>> 9eef924d051b62204fab6f3200e78c906dd27d30
  }
);

export default instance;