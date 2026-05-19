export interface ChatPartnerResponseDTO {
  id: string;
  name: string;
  profileImage?: string;
  /** True when the user has an active booking OR the session ended <24 h ago */
  isChatEnabled: boolean;
  hasUnread: boolean;
}

export interface GetChatPartnersResponseDTO {
  partners: ChatPartnerResponseDTO[];
}
