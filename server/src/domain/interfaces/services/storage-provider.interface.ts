
export interface IStorageProvider {

  uploadImage(
    file: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string>;

  uploadCertificate(
    file: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string>;
  
  uploadWorkoutVideo(
    file:Buffer,
    fileName:string,
    mimeType:string
  ):Promise<string>;

  uploadChatAttachment(
    file: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string>;

  deleteFile(url: string): Promise<void>;
}