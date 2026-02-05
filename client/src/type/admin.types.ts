export type AdminStatus = "active" | "blocked";

export interface Admin {
  id: string;
  email: string;
  status: AdminStatus;
  role: "admin"; 
}

export interface AdminLoginPayload{
  email: string;
  password: string;
}

export type UserBlockPayload={
  userId:string;
}