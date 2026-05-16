import { REVIEW_ROUTES } from "../constants/api.constants";
import api from "./axios";

export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface SubmitReportRequest {
  bookingId: string;
  content: string;
  metrics?: Record<string, unknown>;
  isPrivate?: boolean;
}

export const createReview = async (data: CreateReviewRequest) => {
  const res = await api.post(REVIEW_ROUTES.BASE, data);
  return res.data;
};

export const submitReport = async (data: SubmitReportRequest) => {
  const res = await api.post(REVIEW_ROUTES.REPORTS, data);
  return res.data;
};

export const getTrainerReviews = async (trainerId: string) => {
  const res = await api.get(REVIEW_ROUTES.TRAINER_REVIEWS(trainerId));
  return res.data.data;
};
