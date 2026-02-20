import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  googleAuth, registerUser, verifyOtp, loginUser, 
  forgotPassword, verifyResetOtp, resetPassword 
} from "../../api/auth.api";
import { useAuthStore } from "../../store/use-auth-store";
import toast from "react-hot-toast";

export const useAuth = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleAuthSuccess = (userData: any) => {
    setAuth(userData);
    navigate(`/onboarding/${userData.role}/step-1`);
  };

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (_, variables) => {
      toast.success(`OTP sent to ${variables.email}`); 
      navigate("/verify-otp", { state: { email: variables.email } });
    }
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (res) => {
      toast.success("Account verified successfully!");
      handleAuthSuccess(res.data?.data?.user);
    }
  });
    ;

  const googleMutation = useMutation({
    mutationFn: googleAuth,
    onSuccess: (res) => {
      const userData = res.data?.data?.user || res.data?.user;
      if (!userData) return;

      toast.success("Google Login Successful!");
      if (userData.isOnboardingRequired) {
        handleAuthSuccess(userData);
      } else {
        setAuth(userData);
        const target = userData.role === 'trainer' ? "/trainer/dashboard" : "/home";
        navigate(target, { replace: true });
      }
    }
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      toast.success("Welcome back!"); 
      const userData = res.data?.data?.user || res.data?.user;
      
      if (userData.isOnboardingRequired) {
        handleAuthSuccess(userData);
      } else {
        setAuth(userData);
        const target = userData.role === 'trainer' ? "/trainer/dashboard" : "/home";
        navigate(target, { replace: true });
      }
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (_, vars) => {
      toast.success("Reset OTP sent to your email");
      navigate("/verify-reset-otp", { state: { email: vars.email } });
    },
  });

  const verifyResetOtpMutation = useMutation({
    mutationFn: verifyResetOtp,
    onSuccess: (res) => {
      toast.success("OTP Verified");
      navigate("/reset-password", {
        state: { token: res.data.data.resetToken }, 
      });
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password changed! Please login.");
      navigate("/login");
    },
  });

  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    verifyOtp: verifyOtpMutation.mutate,
    isVerifying: verifyOtpMutation.isPending,
    googleLogin: googleMutation.mutate,
    isGoogleLoading: googleMutation.isPending,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    sendResetOtp: forgotPasswordMutation.mutate,
    verifyResetOtp: verifyResetOtpMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    isSendingOtp: forgotPasswordMutation.isPending,
    isVerifyingOtp: verifyResetOtpMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
  };
};