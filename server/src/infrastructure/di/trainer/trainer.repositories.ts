import { SlotMapper } from "@/infrastructure/database/mappers/slot.mapper";
import { TrainerDetailsMapper } from "@/infrastructure/database/mappers/trainer-details.mapper";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { SlotRespository } from "@/infrastructure/database/repositories/slot.repository";
import { TrainerRepository } from "@/infrastructure/database/repositories/trainer-details.repository";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";

const slotMapper=new SlotMapper();
const userMapper = new UserMapper();
const trainerMapper = new TrainerDetailsMapper();
export const trainerRepositories = {
slotRepository:new SlotRespository(slotMapper),
userRepository:new UserRepository(userMapper),
trainerRepository:new TrainerRepository(trainerMapper,userMapper)
};