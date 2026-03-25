export class SaveHealthMetricsRequestDTO {
  userId!: string;
  height!: number;
  weight!: number;
  targetWeight!: number;
  primaryGoal!: string;

  constructor(data: SaveHealthMetricsRequestDTO) {
    Object.assign(this, data);
  }
}