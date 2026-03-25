export class BlockTrainerRequestDTO {
  userId!: string;

  constructor(data: BlockTrainerRequestDTO) {
    Object.assign(this, data);
  }
}