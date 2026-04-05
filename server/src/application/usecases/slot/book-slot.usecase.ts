import { BookSlotRequestDTO } from "@/application/dto/slot/request/book-slot.dto";
import { BookSlotResponseDTO } from "@/application/dto/slot/response/book-slot";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SLOT_MESSAGES, SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { NotificationType } from "@/domain/constants/notification.constants";
import { SessionType } from "@/domain/constants/session.constants";
import { PlanSessionType } from "@/domain/constants/subscription.constants";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";
import { INotificationService } from "@/domain/interfaces/services/notification-service.interface";


export class BookSlotUseCase implements IBaseUseCase<BookSlotRequestDTO,BookSlotResponseDTO>{
    constructor(
        private readonly _subscriptionRepository:ISubscriptionRepository,
        private readonly _slotRepository:ISlotRepository,
        private readonly _subscriptionPlanRepository:ISubscriptionPlanRepository,
        private readonly _notificationService:INotificationService
    ){}
  async  execute(dto: BookSlotRequestDTO): Promise<BookSlotResponseDTO> {
        const subscription = await this._subscriptionRepository.findActiveByUserId(dto.userId);
        if(!subscription){
            throw new Error(SLOT_MESSAGES.ACTIVE_SUBSCRIPTION_NOT_FOUND);
        }
        const plan = await this._subscriptionPlanRepository.findById(subscription.planId);
        if(!plan){
            throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_PLAN_DETAILS_NOT_FOUND);
        }
        if(subscription.usedCredit>=plan.sessionCredits){
            throw new Error(SLOT_MESSAGES.LIMIT_REACHED_SESSION(plan.sessionCredits));
        }
        const slot = await this._slotRepository.findById(dto.slotId);
        if(!slot){
            throw new Error(SLOT_MESSAGES.SLOT_NOT_FOUND);
        }
        if(plan.sessionType === PlanSessionType.GROUP && slot.type === SessionType.ONE_ON_ONE){
            throw new Error(SLOT_MESSAGES.ONLY_SUPPORT_GROUP);
        }
       
        const isSuccess = await this._slotRepository.bookSlot(dto.slotId,dto.userId);
        if(!isSuccess){
            throw new Error(SLOT_MESSAGES.ALREADY_BOOKED);
        }
        const startTime = new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        await this._notificationService.notify(slot.trainerId, {
            title: "New Booking Received! 🗓️",
            message: `A client has booked your ${slot.type} session at ${startTime}. Check your schedule for details.`,
            type: NotificationType.SLOT_BOOKED
        });
        return {
            message:SLOT_MESSAGES.SLOT_BOOKING_SUCCESS
        };

    }

}