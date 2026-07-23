import axios from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enables automatic HttpOnly cookie handling from Django
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const loginRedirect = '/login';

    // 🚨 1. Security enforcement logic (403 Blocked status)
    if (error.response?.status === 403) {
      const errorDetail = error.response.data?.detail;
      if (errorDetail === "Your account has been blocked by the admin. You are logged out.") {
        if (typeof window !== 'undefined') {
          localStorage.clear(); 
          toast.error("Your account has been blocked by the admin.");

          setTimeout(() => {
            window.location.href = loginRedirect;
          }, 1500);
        }
        return Promise.reject(error);
      }
    }

    // 🔄 2. Automated Token Refresh Logic (401 Unauthorized status)
    const skipUrls = ['accounts/admin/login', 'accounts/token/refresh', 'accounts/logout'];
    const isSkippedUrl = skipUrls.some(url => originalRequest.url?.includes(url));

    if (error.response?.status === 401 && !originalRequest._retry && !isSkippedUrl) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🌟 റിയൽ റിഫ്രഷ് എൻഡ്‌പോയിന്റിലേക്ക് കോൾ ചെയ്യുന്നു
        await axiosInstance.post('/accounts/token/refresh');

        isRefreshing = false;
        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        if (typeof window !== 'undefined') {
          localStorage.clear();
          toast.error('Session expired. Please login again!');
          setTimeout(() => {
            window.location.href = loginRedirect;
          }, 1500);
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;