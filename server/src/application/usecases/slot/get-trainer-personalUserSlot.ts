import { GetTrainerUsersRequestDTO } from "@/application/dto/slot/request/trainer-get-bookedUser.dto";
import { GetTrainerStudentResponseDTO } from "@/application/dto/slot/response/trainer-get-bookedUser.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SessionType } from "@/domain/constants/session.constants";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";


export class GetTrainerOneOnOneUserUseCase implements IBaseUseCase<GetTrainerUsersRequestDTO,GetTrainerStudentResponseDTO>{
    constructor(
        private readonly _slotRepository:ISlotRepository
    ){}
    async execute(dto: GetTrainerUsersRequestDTO): Promise<GetTrainerStudentResponseDTO> {
        const skip = (dto.page - 1) * dto.limit;
        const result = await this._slotRepository.getTrainerParticipants({
            trainerId:dto.trainerId,
            type:SessionType.ONE_ON_ONE,
            skip,
            limit:dto.limit,
            search:dto.search
        });
       const mappedUsers = result.data.map((item)=>({
        userId:item.userId,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        profileImage:item.profileImage,
        totalBookedSlots: item.totalBookedSlots,
        lastSessionTime: item.lastSessionTime
       }));
       return {
        users:mappedUsers,
        total:result.total
       };
    }
}