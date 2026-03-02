import axios from "axios";
import { useAuthStore } from "../store/use-auth-store";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;


    const errorMessage = 
      err.response?.data?.message ||   
      err.response?.data?.errors?.[0]?.message || 
      err.message ||                   
      "Something went wrong";

    if (err.response?.status === 401 && !originalRequest._retry) {
      const publicPaths = ['/', '/login', '/register', '/admin-portal'];
      if (publicPaths.includes(window.location.pathname)) {
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }

      originalRequest._retry = true;
      try {
        const isAdmin = window.location.pathname.startsWith('/admin');
        const endpoint = isAdmin ? "/admin/refresh-token" : "/auth/refresh-token";
        await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, {}, { withCredentials: true });
        return api(originalRequest); 
      } catch (refreshErr) {
        useAuthStore.getState().logout();
        toast.error("Session expired. Please login again.");
        return Promise.reject(refreshErr);
      }
    }

    const isSilentRequest = originalRequest.url?.includes('/me') || originalRequest.url?.includes('/refresh-token');

    if (!isSilentRequest) {
      toast.error(errorMessage, { id: errorMessage });
    }

    return Promise.reject(err);
  }
);

export default api;