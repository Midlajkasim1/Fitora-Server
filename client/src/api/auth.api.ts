import api from "./axios";
import type { 
  RegisterPayload, 
  VerifyOtp, 
  ResendOtp, 
  ForgotPasswordPayload, 
  VerifyResetOtpPayload, 
  ResetPasswordPayload, 
  LoginPayload
} from "../type/auth.types";

export const registerUser = (data: RegisterPayload) => {
  return api.post('/auth/register', data);
};

export const googleAuth = (data: { idToken: string; role: 'user' | 'trainer' }) => {
  return api.post('/auth/google', data);
};

export const verifyOtp = (data: VerifyOtp) => {
  return api.post('/auth/verify-otp', data);
};

export const resendOtp = (data: ResendOtp) => {
  return api.post("/auth/resend-otp", data);
};

export const forgotPassword = (data: ForgotPasswordPayload) => {
  return api.post('/auth/forgot-password', data);
};

export const verifyResetOtp = (data: VerifyResetOtpPayload) => {
  return api.post('/auth/verify-reset-otp', data);
};

export const resetPassword = (data: ResetPasswordPayload) => {
  return api.post('/auth/reset-password', data);
};
export const loginUser = (data: LoginPayload) => {
  return api.post('/auth/login', data);
};

export const getMe= ()=>{
  return api.get('/auth/me')
}
export const logoutUser = () => {
  return api.post("/auth/logout");
};
