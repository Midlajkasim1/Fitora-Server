import { CreateReviewRequestDTO } from "@/application/dto/review/request/create-review.dto";
import { CreateReviewResponseDTO } from "@/application/dto/review/response/create-review.dto";
import { SubmitSessionReportRequestDTO } from "@/application/dto/review/request/submit-session-report.dto";
import { SubmitSessionReportResponseDTO } from "@/application/dto/review/response/submit-session-report.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";
import { ReviewEntity } from "@/domain/entities/review/review.entity";

export class ReviewController {
  constructor(
    private readonly _createReviewUseCase: IBaseUseCase<CreateReviewRequestDTO, CreateReviewResponseDTO>,
    private readonly _submitSessionReportUseCase: IBaseUseCase<SubmitSessionReportRequestDTO, SubmitSessionReportResponseDTO>,
    private readonly _getTrainerReviewsUseCase: IBaseUseCase<string, ReviewEntity[]>
  ) {}

  async createReview(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
    }

    const { bookingId, rating, comment } = req.body;
    const result = await this._createReviewUseCase.execute({
      bookingId,
      userId,
      rating,
      comment,
    });

    return res.status(HttpStatus.CREATED).json(ApiResponse.success(result));
  }

  async submitSessionReport(req: Request, res: Response): Promise<Response> {
    const { bookingId, content, metrics, isPrivate } = req.body;
    const result = await this._submitSessionReportUseCase.execute({
      bookingId,
      content,
      metrics,
      isPrivate,
    });

    return res.status(HttpStatus.CREATED).json(ApiResponse.success(result));
  }

  async getTrainerReviews(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await this._getTrainerReviewsUseCase.execute(id);
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }
}
