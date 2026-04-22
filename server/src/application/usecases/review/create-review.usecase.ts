import mongoose from "mongoose";
import { CreateReviewRequestDTO } from "@/application/dto/review/request/create-review.dto";
import { CreateReviewResponseDTO } from "@/application/dto/review/response/create-review.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IReviewRepository } from "@/domain/interfaces/repositories/review.repository";
import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { ReviewEntity } from "@/domain/entities/review/review.entity";
import { AttendanceStatus } from "@/domain/constants/session.constants";

export class CreateReviewUseCase implements IBaseUseCase<CreateReviewRequestDTO, CreateReviewResponseDTO> {
  constructor(
    private readonly _reviewRepository: IReviewRepository,
    private readonly _bookingRepository: IBookingRepository,
    private readonly _slotRepository: ISlotRepository,
    private readonly _trainerRepository: ITrainerRepository
  ) {}

  async execute(dto: CreateReviewRequestDTO): Promise<CreateReviewResponseDTO> {
    // 1. Verify Booking status is COMPLETED
    const booking = await this._bookingRepository.findById(dto.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Check authorization: ensure the booking belongs to the user
    if (booking.userId.toString() !== dto.userId) {
      throw new Error("Unauthorized: You can only review your own bookings");
    }


    const slot = await this._slotRepository.findById(booking.slotId);
    if (!slot) {
      throw new Error("Slot details not found");
    }




    // 2. Check if a review already exists for this bookingId (prevent duplicates)
    const existingReview = await this._reviewRepository.findByBookingId(dto.bookingId);
    if (existingReview) {
      throw new Error("You have already reviewed this session");
    }

    // 3. Save the Review entity
    const review = new ReviewEntity({
      bookingId: dto.bookingId,
      userId: dto.userId,
      trainerId: slot.trainerId,
      rating: dto.rating,
      comment: dto.comment,
    });


    await this._reviewRepository.create(review);

    // 4. Dynamic Update Logic: Fetch the new average rating for the trainer and update the fields
    const newAverageRating = await this._reviewRepository.calculateAverageRating(slot.trainerId);
    const reviewCount = await this._reviewRepository.count({ trainer_id: new mongoose.Types.ObjectId(slot.trainerId) });

    await this._trainerRepository.updateRating(slot.trainerId, newAverageRating, reviewCount);

    return {
      message: "Review submitted successfully",
    };
  }
}
