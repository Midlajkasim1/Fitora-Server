export class GetChatPartnersRequestDTO {
  userId!: string;
  role!: "trainer" |"user";

  constructor(data: GetChatPartnersRequestDTO) {
    Object.assign(this, data);
  }
}
