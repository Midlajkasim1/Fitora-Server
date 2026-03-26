import { SlotMapper } from "@/infrastructure/database/mappers/slot.mapper";
import { SlotRespository } from "@/infrastructure/database/repositories/slot.repository";

const slotMapper=new SlotMapper();

export const trainerRepositories = {
slotRepository:new SlotRespository(slotMapper)
};