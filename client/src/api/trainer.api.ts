import type { CreateSlotPayload, CreateSlotResponse, EditSlotPayload, TrainerClientsparams, TrainerClientsResponse, TrainerDashboardData, UpcomingSlotsParams, UpcomingSlotsResponse } from "../type/trainer.types";
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

export const createTrainerSlot = async (payload: CreateSlotPayload): Promise<CreateSlotResponse> => {
  const res = await api.post(`trainer/create-slots`, payload);
  return res.data.data;
};
export const editTrainerSlot = async (payload: EditSlotPayload) => {
  const { slotId, ...data } = payload;
  const response = await api.put(`trainer/edit-slots/${slotId}`, data);
  return response.data;
};

export const cancelTrainerSlot = async (slotId: string) => {
  const res = await api.delete(`trainer/${slotId}/cancel`);
  return res.data;
};
