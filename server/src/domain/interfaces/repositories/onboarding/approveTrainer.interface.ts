import { IUserDocument } from "@/infrastructure/database/interfaces/user-document.interface";

export interface TrainerWithUser {
  user_id: IUserDocument | null;
}