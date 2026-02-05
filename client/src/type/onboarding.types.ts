
export type ClientStepOne = {
  dob: string;
  gender: "male" | "female" | "other";
  preferredWorkouts: string[];
  experienceLevel: string;
  primaryMotives: string[];
};

export type ClientStepTwo = {
  dietPreference: string;
  waterIntake: number;
  sleepHours: number;
  medicalConditions: string[];
};

export type ClientOnboardingPayload =
  ClientStepOne & ClientStepTwo;


/* ========= TRAINER ========= */

export interface TrainerStepOneData {
  bio: string;
  experienceYear: number;
  gender: "male" | "female" | "other";
  certificates: File[]; // Used for local state before upload
}

export interface TrainerStepTwoData {
  specializations: string[];
}

// This matches the schema expected by your backend trainerOnboardingSchema
export interface TrainerOnboardingPayload {
  userId: string;
  bio: string;
  experience_year: number;
  gender: string;
  specializations: string[]; // Sent as JSON string via FormData
  certificates?: File[]; // The Multer 'certificates' field
}
export type TrainerApprovalStatus = "pending" | "approved" | "rejected";