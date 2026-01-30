import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOtp, googleAuth } from "../api/auth.api";
import { useAuthStore } from "../store/use-auth-store";

export const useAuth = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleAuthSuccess = (userData: any) => {
    setAuth(userData);
    navigate(`/onboarding/${userData.role}/step-1`);
  };

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (_, variables) => navigate("/verify-otp", { state: { email: variables.email } }),
    onError: (error: any) => alert(error.message)
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (res) => handleAuthSuccess(res.data?.data?.user),
    onError: (error: any) => alert(error.message)
  });

  const googleMutation = useMutation({
    mutationFn: googleAuth,
    onSuccess: (res) => handleAuthSuccess(res.data.data),
    onError: (error: any) => alert(error.message)
  });

  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    verifyOtp: verifyOtpMutation.mutate,
    isVerifying: verifyOtpMutation.isPending,
    googleLogin: googleMutation.mutate,
    isGoogleLoading: googleMutation.isPending,
  };
};