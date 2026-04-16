import { NOTIFICATION_ROUTES } from "../constants/api.constants";
import api from "./axios";


export const getNotifications = () => api.get(NOTIFICATION_ROUTES.GET_ALL);
export const markAsRead = (id: string) => api.patch(NOTIFICATION_ROUTES.MARK_READ(id));

export const markAllAsRead=()=>api.patch(NOTIFICATION_ROUTES.MARK_ALL_READ);
export const clearAllNotifications = () => api.delete(NOTIFICATION_ROUTES.CLEAR_ALL);