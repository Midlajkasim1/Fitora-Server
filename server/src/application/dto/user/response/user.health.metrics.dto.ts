export class SaveHealthMetricsResponseDTO {
  message!: string;

  constructor(data: SaveHealthMetricsResponseDTO) {
    Object.assign(this, data);
  }
}