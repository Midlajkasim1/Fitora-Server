
export class HandleWebhookResponseDTO {
  success!: boolean;
  message!: string;
  recieved:boolean = true;

  constructor(data:Partial<HandleWebhookResponseDTO>) {
    Object.assign(this, data);
  }
}