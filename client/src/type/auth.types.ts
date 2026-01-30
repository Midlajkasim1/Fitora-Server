export type RegisterPayload = {
  role: 'user' | 'trainer';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

export type VerifyOtp = {
  email: string;
  otp: string;
};

export type ResendOtp = {
  email: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyResetOtpPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};
export type LoginPayload = {
  email: string;
  password: string;
};