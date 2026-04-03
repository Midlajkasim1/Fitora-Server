import api from "./axios";


export const getNotifications = () => api.get("user/notifications");
export const markAsRead = (id: string) => api.patch(`user/notifications/${id}/read`);