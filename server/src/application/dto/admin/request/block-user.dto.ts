export class BlockUserRequestDTO {
  userId!: string;

  constructor(data: BlockUserRequestDTO) {
    Object.assign(this, data);
  }
}