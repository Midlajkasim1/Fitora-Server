import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IHealthMetricsRepository } from "@/domain/interfaces/repositories/onboarding/iclient-health-metrics.interface";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GRACE_PERIOD_MS } from "@/domain/constants/chat.constants";
import { GetClientDetailsRequestDTO } from "@/application/dto/trainer/request/get-client-details.dto";
import { ClientDetailsResponseDTO } from "@/application/dto/trainer/response/client-details.dto";
import { AUTH_MESSAGES, USER_MESSAGES } from "@/domain/constants/messages.constants";

export class GetClientDetailsUseCase implements IBaseUseCase<GetClientDetailsRequestDTO, ClientDetailsResponseDTO> {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _healthRepo: IHealthMetricsRepository,
        private readonly _slotRepo: ISlotRepository
    ) {}

    async execute(dto: GetClientDetailsRequestDTO): Promise<ClientDetailsResponseDTO> {
        const { trainerId, clientId } = dto;
        const gracePeriodCutoff = new Date(Date.now() - GRACE_PERIOD_MS);
        const canAccess = await this._slotRepo.hasActiveOrRecentBooking(
            trainerId,
            clientId,
            gracePeriodCutoff
        );

        if (!canAccess) {
            throw new Error(AUTH_MESSAGES.UNAUTHORIZED);
        }

        const [user, health, sessions] = await Promise.all([
            this._userRepo.findById(clientId),
            this._healthRepo.findByUserId(clientId),
            this._slotRepo.getClientSessionHistory(trainerId, clientId)
        ]);

        if (!user) {
            throw new Error(USER_MESSAGES.CLIENT_NOT_FOUND);
        }

    return {
      basicInfo: {
        id: user.id!,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage || null,
        gender: user.gender,
        age: user.dob ? this.calculateAge(user.dob) : undefined,
      },
      healthMetrics: health
        ? {
            weight: health.weight,
            height: health.height,
            targetWeight: health.targetWeight,
            goal: health.primaryGoal,
          }
        : null,
      sessionHistory: sessions.map(s => ({
        slotId: s.id!,
        startTime: s.startTime,
        endTime: s.endTime,
        type: s.type,
        status: s.status
      }))
    };
  }

  private calculateAge(dob: Date | string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
