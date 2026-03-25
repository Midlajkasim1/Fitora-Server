
export class CreateAdvertismentRequest{
  brandName!: string;
  startDate!: Date | string;
  expiryDate!:Date | string;
  brandLink!: string;
  bannerImages?: string[];
  description?:string;
  

  constructor(data: CreateAdvertismentRequest) {
    Object.assign(this, data);
  }
}