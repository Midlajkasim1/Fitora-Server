import api from "./axios";


export const getNotifications = () => api.get("user/notifications");
export const markAsRead = (id: string) => api.patch(`user/notifications/${id}/read`);

export const markAllAsRead=()=>api.patch("user/notifications/mark-all-read");
export const clearAllNotifications = () => api.delete("user/notifications/clear-all");