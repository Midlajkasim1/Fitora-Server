export class GetChatHistoryRequestDTO {
  otherUserId!: string;
  page?: number;
  limit?: number;

  constructor(data: GetChatHistoryRequestDTO) {
    Object.assign(this, data);
  }
}
