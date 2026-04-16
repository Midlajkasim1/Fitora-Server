import api from "./axios";
import type { ClientOnboardingPayload, TrainerOnboardingPayload } from "../type/onboarding.types";
import {useAuthStore} from '../store/use-auth-store'
import { ONBOARDING_ROUTES } from "../constants/api.constants";

export const completeClientOnboarding = (data: ClientOnboardingPayload) => {

  const { user } = useAuthStore.getState();

  return api.post(ONBOARDING_ROUTES.CLIENT_COMPLETE, {
    userId: user?.id, 
    dob: data.dob,
    gender: data.gender,
    preferred_workouts: data.preferredWorkouts, 
    experience_level: data.experienceLevel,   
    primary_motives: data.primaryMotives,     
    diet_preference: data.dietPreference,    
    water_intake: data.waterIntake,           
    sleep_hours: data.sleepHours,              
    medical_conditions: data.medicalConditions, 
  });
};
// 
export const completeTrainerOnboarding = async (data: TrainerOnboardingPayload) => {
  const formData = new FormData();
  formData.append("userId", data.userId);
  formData.append("bio", data.bio);
  formData.append("experience_year", data.experience_year.toString());
  formData.append("gender", data.gender.toLowerCase()); 
  formData.append("specializations", JSON.stringify(data.specializations));

  if (data.certificates && data.certificates.length > 0) {
    data.certificates.forEach((file: File) => {
      formData.append("certificates", file);
    });
  }

  return api.post(ONBOARDING_ROUTES.TRAINER_COMPLETE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getSpecializations=()=>{
  return api.get(ONBOARDING_ROUTES.GET_SPECIALIZATIONS);
}