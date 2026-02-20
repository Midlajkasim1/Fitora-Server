export interface IStorageProvider {
 
  uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string>;

  deleteFile(url: string): Promise<void>;
}