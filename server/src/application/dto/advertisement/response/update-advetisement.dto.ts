
export class UpdateAdvertismentResponse{
  message!: string;

  constructor(data: UpdateAdvertismentResponse) {
    Object.assign(this, data);
  }
}