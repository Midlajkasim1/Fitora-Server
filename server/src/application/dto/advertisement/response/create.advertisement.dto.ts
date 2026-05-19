
export class CreateAdvertismentResponse{
  message!: string;

  constructor(data: CreateAdvertismentResponse) {
    Object.assign(this, data);
  }
}