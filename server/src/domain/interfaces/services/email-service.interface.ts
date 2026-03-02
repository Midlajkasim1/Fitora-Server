export interface IEmailService {
  sendOtp(email: string, otp: string): Promise<void>;
  sendTrainerApprovalEmail(email:string,name:string):Promise<void>;
  sendTrainerRejectEmail(email:string,name:string,reason:string):Promise<void>;
}
