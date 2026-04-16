




export const AUTH_ROUTES = {
  REGISTER: "/auth/register",
  GOOGLE_AUTH: "/auth/google",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_RESET_OTP: "/auth/verify-reset-otp",
  RESET_PASSWORD: "/auth/reset-password",
  LOGIN: "/auth/login",
  GET_ME: "/auth/me",
  LOGOUT: "/auth/logout",
};

export const ONBOARDING_ROUTES = {
  CLIENT_COMPLETE: "/onboarding/user/complete",
  TRAINER_COMPLETE: "/onboarding/trainer/complete",
  GET_SPECIALIZATIONS: "/onboarding/active-specialization",
};

export const USER_ROUTES = {
  PROFILE: "/user/profile",
  PROFILE_IMAGE: "/user/profileImage",
  CHANGE_PASSWORD: "/user/change-password",
  ADVERTISEMENT: "/user/advertisement",
  DASHBOARD: "user/premium-dashboard",
};

export const HEALTH_ROUTES = {
  BASE: "/user/health-metrics",
  CHECK: "user/health-metrics/check",
  WEEKLY_UPDATE: "/user/health-metrics/weekly-update",
};

export const BOOKING_ROUTES = {
  UPCOMING_SESSIONS: "user/upcoming-session",
  BOOKING_TRAINERS: "user/booking/trainers",
  SLOTS: "user/slots",
  BOOK_SLOT: (slotId: string) => `user/slots/${slotId}/book`,
  CANCEL_BOOKING: (slotId: string) => `user/slots/${slotId}/cancel`,
};

export const AI_ROUTES = {
  GENERATE_WORKOUT: "user/generate-workout",
  GENERATE_DIET: "user/generate-diet",
  FETCH_WORKOUT_PLAN: "user/workout-plan",
  FETCH_DIET_PLAN: "user/diet-plan",
};


export const ADMIN_ROUTES = {
  LOGIN: "/admin/login",
  ME: "/admin/me",
  LOGOUT: "/admin/logout",
  
  BLOCK_USER: (userId: string) => `/admin/users/${userId}/block`,
  BLOCK_TRAINER: (userId: string) => `/admin/trainers/${userId}/block`,
  BLOCK_SPECIALIZATION: (id: string) => `/admin/specializations/${id}/block`,
  
  WORKOUTS: "/admin/workouts",
  TOGGLE_WORKOUT: (id: string) => `/admin/workouts/${id}/status`,
  
  ADVERTISEMENTS: "/admin/advertisement",
  TOGGLE_AD: (id: string) => `/admin/advertisement/${id}/status`,
  CREATE_AD: "/admin/create-ad",
  GET_AD_BY_ID: (id: string) => `/admin/advertisement/${id}`,
  UPDATE_AD: (id: string) => `/admin/update-ad/${id}`,
};

export const TRAINER_ROUTES = {
  DASHBOARD: "/trainer/dashboard",
  PROFILE: "/trainer/profile",
  EDIT_PROFILE: "/trainer/edit-profile",
  PROFILE_IMAGE: "/trainer/profileImage",
  CHANGE_PASSWORD: "/trainer/change-password",
  
  UPCOMING_SLOTS: "trainer/upcoming-slots",
  CREATE_SLOTS: "trainer/create-slots",
  EDIT_SLOT: (id: string) => `trainer/edit-slots/${id}`,
  CANCEL_SLOT: (id: string) => `trainer/${id}/cancel`,
  
  CLIENTS: (type: string) => `trainer/${type}`,
};

export const NOTIFICATION_ROUTES = {
  GET_ALL: "/user/notifications",
  MARK_ALL_READ: "/user/notifications/mark-all-read",
  CLEAR_ALL: "/user/notifications/clear-all",
  MARK_READ: (id: string) => `/user/notifications/${id}/read`,
};