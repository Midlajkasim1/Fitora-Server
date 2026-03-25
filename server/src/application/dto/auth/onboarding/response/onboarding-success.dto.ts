// export interface OnboardingResponseDTO {
//   success: boolean;
//   message: string;
// }
export class OnboardingResponseDTO {
  success!: boolean;
  message!: string;

  constructor(data: OnboardingResponseDTO) {
    Object.assign(this, data);
  }
}