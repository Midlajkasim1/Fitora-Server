
export const AUTH_MESSAGES = {
  EMAIL_ALREADY_EXISTS: "User with this email already exists",
  INVALID_CREDENTIALS: "The email or password you entered is incorrect",
  USER_NOT_FOUND: "No account found with this email address",
  OTP_SENT: "OTP sent successfully to your email",
  OTP_RESENT:"OTP resent successfully",
  USERLOGOUT:"User logged out successfully",
  LOGINSUCCESS:"Login successful",
  VERIFICATION_SUCCESS: "Account verified successfully. Welcome!",
  OTP_COOLDOWN: "Please wait before requesting a new OTP.",
  OTP_INVALID: "The OTP you entered is incorrect.",
  ONBOARDING_COMPLETE: "Onboarding profile submitted successfully",
  UNAUTHORIZED: "You are not authorized to perform this action",
  REFRESH_TOKEN_MISSING: "Session expired: Refresh token is missing",
  SESSION_EXPIRED: "Your session has expired. Please log in again",
  REGISTER_FAIL:"Registration failed",
  SIGNUP_INVALID:"Invalid registration session. Please sign up again",
  ADMIN_LOGIN:"Admin logged out successfully",
  ADMIN_SESSION_EXPIRED:"Admin session expired",
  FORGOT_PASSWORD_SUCCESS: "OTP sent successfully to your email",
  FAILED_FETCH_USER:"Failed to fetch users",
  ADMIN_BLOCK:"Admin blocked",
  PASSWORD_UPDATE:"Password updated successfully",
  RESET_SESSION_EXPIRED: "Reset session expired. Please restart the process",
  SESSION_INVALID: "Your session is no longer valid",
  ENTITY_ID_MISSING: "Technical error: Entity ID is missing from the database record",
  ADMIN_NOT_FOUND:"Admin not found",
  OTPS_EXPIRED: "OTP expired or invalid session.",
  ACCOUNT_NOT_VERIFIED: "Please verify your email address before logging in",
  INVALID_SESSION: "Session invalid or your account has been suspended",
  ACCOUNT_BLOCKED: "Your account has been suspended. Please contact support",
  INVALID_TOKEN:"Invalid token" ,
  TRAINER_STATUS_UPDATED: (status: string) => `Trainer status successfully updated to ${status}`,
  USER_STATUS_UPDATED: (status: string) => `User status successfully updated to ${status}`,


};


export const ONBOARDING_MESSAGES = {
  TRAINER_SUBMITTED: "Trainer onboarding submitted successfully and is pending approval",
  UPLOAD_FAILED: "Failed to upload certifications. Please try again.",
  CLIENT_COMPLETE: "User onboarding profile completed successfully. Welcome to Fitora!",
};



export const SPECIALIZATION_MESSAGES ={
   NAME_ALREADY_EXIST:"Name is already exist" ,
   SPECIALIZATION_CREATED:"specialization is created",
   SPECIALIZATION_NOT_FOUND:"specialization not found",
    SPECIALIZATION_UPDATED:"specialization updated"

   

};