export interface UpcomingSession {
  slotId: string;
  startTime: string;
  endTime: string;
  type: 'one_on_one' | 'group';
  status: string;
  capacity: number;
  bookedCount: number;
}

export interface TrainerDashboardData {
  totalClients: number;
  upcomingSessions: UpcomingSession[];
}

export interface TrainerClient {
  slotId: string;
  userId: string;
  startTime: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
}

export interface TrainerClientsResponse {
  users: TrainerClient[];
  total: number;
}

export interface TrainerClientsparams{
  type: 'personal' | 'group', 
  page: number, 
  search: string ;
}

export interface UpcomingSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  type: 'one_on_one' | 'group';
  status: string;
  capacity: number;
  bookedCount: number;
}

export interface UpcomingSlotsResponse {
  slots: UpcomingSlot[];
  total: number;
}

export interface UpcomingSlotsParams {
  page: number;
  limit: number;
}
export interface CreateSlotResponse {
  id: string;
  trainerId: string;
  startTime: string;
  endTime: string;
  type: string;
  capacity: number;
  status: string;
  message: string;
}
export interface CreateSlotPayload {
  slotId?: string;
  type: 'one_on_one' | 'group';
  capacity: number;
  startTime: string;
  endTime: string;
}


export interface EditSlotPayload {
  slotId: string;
  type: 'one_on_one' | 'group';
  capacity: number;
  startTime: string;
  endTime: string;
}
export interface TrainerProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  experience_year: number;
  status: string;
  profileImage?: string;
  specializationName?: string;
}

export interface UpdateTrainerProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  experience_year?: number;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface TrainerProfileResponse {
  success: boolean;
  data: TrainerProfile;
}