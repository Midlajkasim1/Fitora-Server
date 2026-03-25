import { AdvertisementManagmentDTO } from "./advertisment-management.dto";



export class GetAllAdvertismentResponse{
  Advertisement!:AdvertisementManagmentDTO[];
  total!:number;
  constructor(data: GetAllAdvertismentResponse) {
    Object.assign(this, data);
  }
}