import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";
import { env } from "@/infrastructure/config/env.config";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";


export class S3StorageProvider implements IStorageProvider {
  private readonly _s3Client: S3Client;
  private readonly _bucketName: string;

  constructor() {
    this._s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this._bucketName = env.S3_BUCKET_NAME;
  }

  async uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string> {
    const cleanFileName = fileName.replace(/\s+/g, "-");
    const key = `trainers/certificates/${Date.now()}-${cleanFileName}`;

    const parallelUploads3 = new Upload({
      client: this._s3Client,
      params: {
        Bucket: this._bucketName,
        Key: key,
        Body: file,
        ContentType: mimeType,
      },
    });

    await parallelUploads3.done();

    return `https://${this._bucketName}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async deleteFile(url: string): Promise<void> {
    const urlParts = url.split(`${this._bucketName}.s3.${env.AWS_REGION}.amazonaws.com/`);
    const key = urlParts[1];
    
    if (key) {
      await this._s3Client.send(
        new DeleteObjectCommand({
          Bucket: this._bucketName,
          Key: key,
        })
      );
    }
  }
}