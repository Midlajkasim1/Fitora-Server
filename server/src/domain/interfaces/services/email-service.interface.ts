export interface IEmailService {
  sendOtp(email: string, otp: string): Promise<void>;
  sendTrainerApprovalEmail(email:string,name:string):Promise<void>;
  sendTrainerRejectEmail(email:string,name:string,reason:string):Promise<void>;
  sendReportUpdateEmail(email: string, name: string, status: string, reason: string): Promise<void>;
}
