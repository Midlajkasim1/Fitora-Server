
export class GetSpecializationByIdRequestDTO {
  id!: string;

  constructor(data: GetSpecializationByIdRequestDTO) {
    Object.assign(this, data);
  }
}