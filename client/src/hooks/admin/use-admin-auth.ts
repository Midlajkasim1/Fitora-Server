import { jwtDecode } from "jwt-decode";
import { adminLogin } from "../../api/admin.api";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/use-auth-store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 
import type { UserRole } from "../../type/auth.types";

interface DecodedToken {
  userId: string;
  email: string;
  role: UserRole;
}

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: (res) => {
      const token = res.data?.data?.accessToken || res.data?.accessToken;

      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);

        setAuth({
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          isOnboardingRequired: false
        });
        
        toast.success("Welcome back, Administrator"); 
        navigate("/admin/dashboard", { replace: true });
      }
    },
  });

  return { 
    login: loginMutation.mutate, 
    isLoading: loginMutation.isPending 
  };
};