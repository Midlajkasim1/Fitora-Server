import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";

export class GetAllAdvertismentRequest{
  page!: number;
  limit!: number;
  search?: string;
  status?: AdvertisementStatus;
  constructor(data: GetAllAdvertismentRequest) {
    Object.assign(this, data);
  }
}