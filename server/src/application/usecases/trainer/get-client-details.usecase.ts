import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IHealthMetricsRepository } from "@/domain/interfaces/repositories/onboarding/iclient-health-metrics.interface";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";

export interface GetClientDetailsRequestDTO {
  trainerId: string;
  clientId: string;
}

export interface ClientDetailsOutput {
  basicInfo: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string | null;
    gender?: string;
    age?: number;
  };
  healthMetrics: {
    weight: number;
    height: number;
    targetWeight: number;
    goal: string;
  } | null;
  sessionHistory: Array<{
    slotId: string;
    startTime: Date;
    endTime: Date;
    type: string;
    status: string;
  }>;
}

const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000;

export class GetClientDetailsUseCase implements IBaseUseCase<GetClientDetailsRequestDTO, ClientDetailsOutput> {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _healthRepo: IHealthMetricsRepository,
    private readonly _slotRepo: ISlotRepository
  ) {}

  async execute(dto: GetClientDetailsRequestDTO): Promise<ClientDetailsOutput> {
    const { trainerId, clientId } = dto;
    const gracePeriodCutoff = new Date(Date.now() - GRACE_PERIOD_MS);
    const canAccess = await this._slotRepo.hasActiveOrRecentBooking(
      trainerId,
      clientId,
      gracePeriodCutoff
    );

    if (!canAccess) {
      throw new Error("Unauthorized: You can only view details for your assigned clients.");
    }

    const [user, health, sessions] = await Promise.all([
      this._userRepo.findById(clientId),
      this._healthRepo.findByUserId(clientId),
      this._slotRepo.getClientSessionHistory(trainerId, clientId)
    ]);

    if (!user) {
      throw new Error("Client not found.");
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
        slotId: s._id.toString(),
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
