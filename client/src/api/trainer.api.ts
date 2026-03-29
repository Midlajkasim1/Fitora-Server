import type { CreateSlotResponse, TrainerClientsparams, TrainerClientsResponse, TrainerDashboardData, UpcomingSlotsParams, UpcomingSlotsResponse } from "../type/trainer.types";
import type { CreateSlotInput } from "../validators/trainer/Slot.validator";
import api from "./axios";


export const  trainerDashboard = async ():Promise<TrainerDashboardData>=>{
 const data =  await api.get("/trainer/dashboard")
 return data?.data?.data;
}

export const getTrainerClients = async (params:TrainerClientsparams):Promise<TrainerClientsResponse>=>{
    const {type,page,search} = params
    const res = await api.get(`trainer/${type}`,{
        params:{page,limit:6,search}
    })
    return res.data.data;
}
export const getTrainerUpcomingSlots = async (params: UpcomingSlotsParams): Promise<UpcomingSlotsResponse> => {
  const { page, limit } = params;
  const res = await api.get(`trainer/upcoming-slots`, {
    params: { page, limit }
  });
  return res.data?.data;
};

export const createTrainerSlot = async (payload: CreateSlotInput): Promise<CreateSlotResponse> => {
  const res = await api.post(`trainer/create-slots`, payload);
  return res.data.data;
};