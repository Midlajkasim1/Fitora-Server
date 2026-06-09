import axios from "axios";
import type { AxiosInstance } from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/use-auth-store";

export const attachLogicToApi = (apiInstance: AxiosInstance) => {
  
  apiInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        const publicPages = [
          "/",
          "/login",
          "/register",
          "/verify-otp",
          "/verify-reset-otp",
          "/forgot-password",
          "/reset-password",
          "/admin-portal",
        ];
        
        const publicUrls = [
          "/auth/login",
          "/auth/register",
          "/auth/verify-otp",
          "/auth/resend-otp",
          "/auth/forgot-password",
          "/auth/verify-reset-otp",
          "/auth/reset-password",
          "/auth/google",
          "/admin/login",
        ];

        const isPublicPage = publicPages.includes(window.location.pathname);
        const isPublicUrl = publicUrls.some(url => originalRequest.url?.includes(url));

        if (!isPublicPage && !isPublicUrl) {
          originalRequest._retry = true;

          try {
            const isAdmin = window.location.pathname.startsWith("/admin");
            const refreshUrl = isAdmin ? "/admin/refresh-token" : "/auth/refresh-token";
            
            await axios.post(`${import.meta.env.VITE_API_URL}${refreshUrl}`, {}, { withCredentials: true });

            return apiInstance(originalRequest);
          } catch (refreshError) {
            useAuthStore.getState().logout();
            toast.error("Session expired. Please login again.");
            return Promise.reject(refreshError);
          }
        }
      }

      const errorMessage = error.response?.data?.message || "An error occurred";
      
      const silentUrls = ["/me", "/refresh-token"];
      const isSilent = silentUrls.some(url => originalRequest.url.includes(url));

      if (!isSilent) {
        toast.error(errorMessage);
      }

      return Promise.reject(error);
    }
  );
};