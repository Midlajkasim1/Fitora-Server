import { NotificationType } from "@/domain/constants/notification.constants";

export interface INotificationService {

  notify(userId: string, data: { 
    title: string; 
    message: string; 
    type: NotificationType 
  }): Promise<void>;


  broadcast(data: { 
    title: string; 
    message: string; 
    type: NotificationType
  }): Promise<void>;
}