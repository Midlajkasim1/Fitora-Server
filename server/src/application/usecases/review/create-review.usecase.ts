import mongoose from "mongoose";
import { CreateReviewRequestDTO } from "@/application/dto/review/request/create-review.dto";
import { CreateReviewResponseDTO } from "@/application/dto/review/response/create-review.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IReviewRepository } from "@/domain/interfaces/repositories/review.repository";
import { IBookingRepository } from "@/domain/interfaces/repositories/booking.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { ReviewEntity } from "@/domain/entities/review/review.entity";
import { AUTH_MESSAGES, REVIEW_MESSAGES, SLOT_MESSAGES } from "@/domain/constants/messages.constants";

export class CreateReviewUseCase implements IBaseUseCase<CreateReviewRequestDTO, CreateReviewResponseDTO> {
  constructor(
    private readonly _reviewRepository: IReviewRepository,
    private readonly _bookingRepository: IBookingRepository,
    private readonly _slotRepository: ISlotRepository,
    private readonly _trainerRepository: ITrainerRepository
  ) {}

  async execute(dto: CreateReviewRequestDTO): Promise<CreateReviewResponseDTO> {
    const booking = await this._bookingRepository.findById(dto.bookingId);
    if (!booking) {
      throw new Error(REVIEW_MESSAGES.BOOKING_NOT_FOUND);
    }

    if (booking.userId.toString() !== dto.userId) {
      throw new Error(AUTH_MESSAGES.UNAUTHORIZED);
    }


    const slot = await this._slotRepository.findById(booking.slotId);
    if (!slot) {
      throw new Error(SLOT_MESSAGES.SLOT_NOT_FOUND);
    }




    const existingReview = await this._reviewRepository.findByBookingId(dto.bookingId);
    if (existingReview) {
      throw new Error(REVIEW_MESSAGES.ALREADY_REVIEWED);
    }

    const review = new ReviewEntity({
      bookingId: dto.bookingId,
      userId: dto.userId,
      trainerId: slot.trainerId,
      rating: dto.rating,
      comment: dto.comment,
    });


    await this._reviewRepository.create(review);

    const newAverageRating = await this._reviewRepository.calculateAverageRating(slot.trainerId);
    const reviewCount = await this._reviewRepository.count({ trainer_id: new mongoose.Types.ObjectId(slot.trainerId) });

    await this._trainerRepository.updateRating(slot.trainerId, newAverageRating, reviewCount);

    return {
      message: REVIEW_MESSAGES.REVIEW_SUBMITTED,
    };
  }
}
