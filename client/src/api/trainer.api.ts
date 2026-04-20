import { TRAINER_ROUTES } from "../constants/api.constants";
import type { ChangePasswordPayload, CreateSlotPayload, CreateSlotResponse, EditSlotPayload, TrainerClientsparams, TrainerClientsResponse, TrainerDashboardData, TrainerProfile, UpcomingSlotsParams, UpcomingSlotsResponse, UpdateTrainerProfilePayload } from "../type/trainer.types";
import api from "./axios";


export const  trainerDashboard = async ():Promise<TrainerDashboardData>=>{
 const data =  await api.get(TRAINER_ROUTES.DASHBOARD)
 return data?.data?.data;
}

export const getTrainerClients = async (params:TrainerClientsparams):Promise<TrainerClientsResponse>=>{
    const {type,page,search} = params
    const res = await api.get(TRAINER_ROUTES.CLIENTS(type),{
        params:{page,limit:6,search}
    })
    return res.data.data;
}
export const getTrainerUpcomingSlots = async (params: UpcomingSlotsParams): Promise<UpcomingSlotsResponse> => {
  const { page, limit } = params;
  const res = await api.get(TRAINER_ROUTES.UPCOMING_SLOTS, {
    params: { page, limit }
  });
  return res.data?.data;
};

export const createTrainerSlot = async (payload: CreateSlotPayload): Promise<CreateSlotResponse> => {
  const res = await api.post(TRAINER_ROUTES.CREATE_SLOTS, payload);
  return res.data.data;
};
export const editTrainerSlot = async (payload: EditSlotPayload) => {
  const { slotId, ...data } = payload;
  const response = await api.put(TRAINER_ROUTES.EDIT_SLOT(slotId), data);
  return response.data;
};

export const cancelTrainerSlot = async (slotId: string) => {
  const res = await api.delete(TRAINER_ROUTES.CANCEL_SLOT(slotId));
  return res.data;
};


export const getTrainerProfile = async (): Promise<TrainerProfile> => {
  const res = await api.get(TRAINER_ROUTES.PROFILE);
  return res.data.data;
};

export const updateTrainerProfile = async (payload: UpdateTrainerProfilePayload): Promise<void> => {
  await api.put(TRAINER_ROUTES.EDIT_PROFILE, payload);
};

export const uploadTrainerAvatar = async (formData: FormData): Promise<{ profileImage: string }> => {
  const res = await api.put(TRAINER_ROUTES.PROFILE_IMAGE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const changeTrainerPassword = async (payload: ChangePasswordPayload): Promise<void> => {
  await api.put(TRAINER_ROUTES.CHANGE_PASSWORD, payload);
};

export const getClientDetails = async (clientId: string) => {
  const res = await api.get(TRAINER_ROUTES.CLIENT_DETAILS(clientId));
  return res.data.data;
};