
export const AUTH_MESSAGES = {
  EMAIL_ALREADY_EXISTS: "User with this email already exists",
  PASSWORD_NOT_CORRECT:"password not correct",
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
  ADMIN_ACESS_DENIED:"Access denied. Admin privileges required",
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
  PROFILE_IMAGE_UPDATED:"Profile updated",
  FILE_NOT_FOUND:"No file uploaded",  
  USER_AUTHENTICATION_NOT_FOUND:"User authentication data is incomplete. Please log in again.",
  AUTHENTICATION_REQUIRED:"Authentication is required",
  TRAINER_ID_NOT_FOUND:"Trainer not found"


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
    SPECIALIZATION_UPDATED:"specialization updated",
    SPECIALIZATION_ID_MISSING:"specialization id missing",
    SPECIALIZATION_STATUS_UPDATED: (status: string) => `specialization status successfully updated to ${status}`,

};
export const  USER_MESSAGES={
  PROFILE_UPDATED:"Profile updated successfully"
};

export const  ADMIN_MESSAGES={
  TRAINER_NOT_FOUND:"Trainer id is not found",
  TRAINER_REJECTION_REASON:"Rejection reason is required",
  TRAINER_APPROVAL_DONE:"verfied trainer profile"

};

export const WORKOUT_MESSAGES={
  WORKOUT_NOT_FOUND:"Workout not found",
  FILES_MUST_REQUIRED:"Video and thumbnail are required",
  WORKOUT_UPDATED:"Workout updated successfully",
  WORKOUT_ALREADY_EXIST:"Workout already exists",
  WORKOUT_STATUS_UPDATED:"Workout status updated",
  WORKOUT_NOT_MATCH:"No workout matches this time and difficulty for this specialization",
  WORKOUT_CREATION_FAILED:"Workout creation falied"
};

export const SUBSCRIPTION_MESSAGES={
  SUBSCRIPTION_ALREADY_EXISTS:"Subscription already exists",
  SUBSCRIPTION_PLAN_CREATED:"Subcription plan created",
  SUBSCRIPTION_NOT_FOUND:"Subscription not found",
  SUBSCRIPTION_PLAN_UPDATED:"Subcription plan updated",
  SUBSCRIPTION_PLAN_STATUS_UPDATED:"Subcription plan stated updated",
  SUBSCRIPTION_ALREADY_HAVE:"You already have an  active plan",
  SUBSCRIPTION_CANCELLED:"Subscription cancelled successfully"  ,
  SUBSCRIPTION_ACTIVATED:"Subscription activated",
  SUBSCRIPTION_SESSION_EXPIRED:"Session expired, subscription cancelled",
  SUBCRIPTION_UNHANDLED_TYPE:"Unhandled event type",
  SUBSCRIPTION_CHECKOUT_SESSION_COMPLETED:"checkout.session.completed",
  SUBSCRIPTION_CHECKOUT_SESSION_EXPIRED:"checkout.session.expired",

    

};
export const PAYMENT_MESSAGES={
  PAYMENT_NOT_FOUND:"Payment not found for provider session",
  MISSING_STRIPE_SIGNATURE:"Missing stripe signature",
  INVALID_WEBHOOK_SIGNATURE:"Invalid webhook signature",
  STRIPE_FAILED_TO_CREATE_CHECKOUT_URL:"Stripe failed to create checkout URL"
};
export const HEALTH_METRICS_MESSAGES={
  HEALTH_METRICS_SAVED:"Health metrics saved successfully"
};

export const ADVERTISEMENT_MESSAGES={
  ADS_BANNER_IMAGE_IS_REQUIRED:"Advertisement banner image is required",
  ADS_CREATED:"Advertisement created successfully",
  NO_IMAGES_UPLOADED:"No images uploaded" ,
  ADS_NOT_FOUND:"Ads not found ",
  ADS_UPDATED:"updated sucessfully",
  ADS_ID_MISSING:"Ad id is missing",
  ADVERTISEMENT_STATUS_UPDATED: (status: string) => `Advertisement status successfully updated to ${status}`,

};

export const SLOT_MESSAGES={
  SLOT_IS_FULL:"Slot is full or not available",
  USER_ALREADY_BOOKED:"User already booked this slot",
  CANNOT_CREATE_SLOT_IN_PAST:"Cannot create a slot in the past",
  SLOT_TIME_MUST_BE_AFTER_START_TIME:"End time must be after start time",
  SESSION_SLOT_MUST_HOUR:"Each session slot must be exactly 1 hour (60 minutes)",
  SINGLE_SESSION_CANNOT_SPAN_ACROSS_MULTIPLE_DAYS:"A single session cannot span across multiple days",
  ALREADY_HAVE_A_SESSION_SCHEDULED_THAT_OVERLAPS_WITH_TIME:"You already have a session scheduled that overlaps with this time",
  SLOT_CREATED_SUCESSFULLY:"workout slot created successfully"

};