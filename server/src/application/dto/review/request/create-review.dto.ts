export interface CreateReviewRequestDTO {
  bookingId: string;
  userId: string;
  rating: number;
  comment?: string;
}
