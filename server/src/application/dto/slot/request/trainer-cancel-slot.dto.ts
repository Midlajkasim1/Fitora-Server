

export class TrainerCancelSlotRequestDTO{
    slotId!: string;
  trainerId!: string;
  constructor(data:TrainerCancelSlotRequestDTO){
    Object.assign(this,data);
  }
}