import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://coachak-backendend.onrender.com/";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

const getRefreshToken = async () => {
  try {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${BASE_URL}/api/v1/auth/refresh-token`,
      {
        refreshToken,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    // Clear tokens if refresh fails
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
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
      "/api/v1/auth/refresh-token",
    ];

    if (authRoutes.some((route) => config.url.includes(route))) {
      return config;
    }

    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to expired JWT
    const isJwtExpired = error.response?.data?.message === "jwt expired";
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
        Cookies.set("accessToken", accessToken, { expires: 5 / 24 });

        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Notify all waiting requests
        onTokenRefreshed(accessToken);

        // Retry the original request
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);

        // Clear tokens and redirect to login
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        if (typeof window !== "undefined") {
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default instance;
