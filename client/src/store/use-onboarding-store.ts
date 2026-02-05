import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ClientStepOne,
  ClientStepTwo,
  ClientOnboardingPayload,
  TrainerOnboardingPayload,
  TrainerStepOneData,
  TrainerStepTwoData,
} from "../type/onboarding.types";

type OnboardingState = {
  clientStepOne?: ClientStepOne;
  clientStepTwo?: ClientStepTwo;

  setClientStepOne: (data: ClientStepOne) => void;
  setClientStepTwo: (data: ClientStepTwo) => void;
  getClientPayload: () => ClientOnboardingPayload | null;
  clearClient: () => void;

trainerStepOne?: TrainerStepOneData; 
  trainerStepTwo?: TrainerStepTwoData; 
  setTrainerStepOne: (data: TrainerStepOneData) => void;
  setTrainerStepTwo: (data: TrainerStepTwoData) => void;
  getTrainerPayload: (userId: string) => TrainerOnboardingPayload | null;
  clearTrainer: () => void;

  clearAll: () => void;
};
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      clientStepOne: undefined,
      clientStepTwo: undefined,

      setClientStepOne: (data) => set({ clientStepOne: data }),
      setClientStepTwo: (data) => set({ clientStepTwo: data }),

      getClientPayload: () => {
        const { clientStepOne, clientStepTwo } = get();
        if (!clientStepOne || !clientStepTwo) return null;
        return { ...clientStepOne, ...clientStepTwo };
      },

      clearClient: () =>
        set({ clientStepOne: undefined, clientStepTwo: undefined }),

      trainerStepOne: undefined,
      trainerStepTwo: undefined,

      setTrainerStepOne: (data) => set({ trainerStepOne: data }),
      setTrainerStepTwo: (data) => set({ trainerStepTwo: data }),

      getTrainerPayload: (userId: string) => {
        const { trainerStepOne, trainerStepTwo } = get();
        if (!trainerStepOne || !trainerStepTwo) return null;

        return {
          userId,
          bio: trainerStepOne.bio,
          experience_year: trainerStepOne.experienceYear,
          gender: trainerStepOne.gender,
          certificates: trainerStepOne.certificates,
          specializations: trainerStepTwo.specializations,
        };
      },

      clearTrainer: () =>
        set({ trainerStepOne: undefined, trainerStepTwo: undefined }),

      clearAll: () =>
        set({
          clientStepOne: undefined,
          clientStepTwo: undefined,
          trainerStepOne: undefined,
          trainerStepTwo: undefined,
        }),
    }),
    {
      name: "onboarding-storage",
      partialize: (state) => ({
        clientStepOne: state.clientStepOne,
        clientStepTwo: state.clientStepTwo,
        trainerStepOne: state.trainerStepOne ? { ...state.trainerStepOne, certificates: [] } : undefined,
        trainerStepTwo: state.trainerStepTwo,
      }),
    }
  )
);
