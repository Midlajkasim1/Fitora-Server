export enum UserRole {
  USER = "user",
  TRAINER = "trainer",
  
}

export enum UserStatus {
  ACTIVE = "active",
  BLOCKED = "blocked"
}

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google"
}

export enum AdminStatus {
    ACTIVE = "active",
    BLOCKED = "blocked"
}

export const OTP_PREFIXES = {
  FORGOT_PASSWORD: "otp:forgot-password:",
  RESET_SESSION: "reset-session:",
};

export enum ExperienceLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced"
}


export enum DietPreference {
  VEGETARIAN = "vegetarian",
  VEGAN = "vegan",
  KETO = "keto",
  OMNIVORE = "omnivore"
}

export enum AdminRole {
  ADMIN = "admin"
}

export enum SpecializationStatus{
  ACTIVE = "active",
  BLOCKED ="blocked"
}