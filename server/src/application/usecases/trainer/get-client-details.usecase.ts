import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { IHealthMetricsRepository } from "@/domain/interfaces/repositories/onboarding/iclient-health-metrics.interface";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";

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
}

const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000;

export class GetClientDetailsUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _healthRepo: IHealthMetricsRepository,
    private readonly _slotRepo: ISlotRepository
  ) {}

  async execute(trainerId: string, clientId: string): Promise<ClientDetailsOutput> {
    const gracePeriodCutoff = new Date(Date.now() - GRACE_PERIOD_MS);
    const canAccess = await this._slotRepo.hasActiveOrRecentBooking(
      trainerId,
      clientId,
      gracePeriodCutoff
    );

    if (!canAccess) {
      throw new Error("Unauthorized: You can only view details for your assigned clients.");
    }

    const [user, health] = await Promise.all([
      this._userRepo.findById(clientId),
      this._healthRepo.findByUserId(clientId),
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
