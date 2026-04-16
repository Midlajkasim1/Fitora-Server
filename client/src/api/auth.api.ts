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
import { AUTH_ROUTES } from "../constants/api.constants";

export const registerUser = (data: RegisterPayload) => {
  return api.post(AUTH_ROUTES.REGISTER, data);
};

export const googleAuth = (data: { idToken: string; role: 'user' | 'trainer' }) => {
  return api.post(AUTH_ROUTES.GOOGLE_AUTH, data);
};

export const verifyOtp = (data: VerifyOtp) => {
  return api.post(AUTH_ROUTES.VERIFY_OTP, data);
};

export const resendOtp = (data: ResendOtp) => {
  return api.post(AUTH_ROUTES.RESEND_OTP, data);
};

export const forgotPassword = (data: ForgotPasswordPayload) => {
  return api.post(AUTH_ROUTES.FORGOT_PASSWORD, data);
};

export const verifyResetOtp = (data: VerifyResetOtpPayload) => {
  return api.post(AUTH_ROUTES.VERIFY_RESET_OTP, data);
};

export const resetPassword = (data: ResetPasswordPayload) => {
  return api.post(AUTH_ROUTES.RESET_PASSWORD, data);
};
export const loginUser = (data: LoginPayload) => {
  return api.post(AUTH_ROUTES.LOGIN, data);
};

export const getMe= ()=>{
  ;
  return api.get(AUTH_ROUTES.GET_ME)
  ;
}
export const logoutUser = () => {
  return api.post(AUTH_ROUTES.LOGOUT);
};
