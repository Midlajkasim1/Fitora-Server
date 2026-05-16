import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";
import { env } from "@/infrastructure/config/env.config";
import {
  DeleteObjectCommand,
  S3Client,
  PutObjectCommand
} from "@aws-sdk/client-s3";
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

  async uploadImage(
    file: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {

    const key = `users/profile/${Date.now()}-${fileName}`;

    await this._s3Client.send(
      new PutObjectCommand({
        Bucket: this._bucketName,
        Key: key,
        Body: file,
        ContentType: mimeType,
      })
    );

    return `https://${this._bucketName}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async uploadCertificate(
    file: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {

    const key = `trainers/certificates/${Date.now()}-${fileName}`;

    const upload = new Upload({
      client: this._s3Client,
      params: {
        Bucket: this._bucketName,
        Key: key,
        Body: file,
        ContentType: mimeType,
      },
    });

    await upload.done();

    return `https://${this._bucketName}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  }


async uploadWorkoutVideo(
  file: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {

  const key = `workouts/videos/${Date.now()}-${fileName}`;

  await this._s3Client.send(
    new PutObjectCommand({
      Bucket: this._bucketName,
      Key: key,
      Body: file,
      ContentType: mimeType,
    })
  );

  return `https://${this._bucketName}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

  async uploadChatAttachment(
    file: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {
    const key = `chat/attachments/${Date.now()}-${fileName}`;

    await this._s3Client.send(
      new PutObjectCommand({
        Bucket: this._bucketName,
        Key: key,
        Body: file,
        ContentType: mimeType,
      })
    );

    return `https://${this._bucketName}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async deleteFile(url: string): Promise<void> {
    const urlParts = url.split(
      `${this._bucketName}.s3.${env.AWS_REGION}.amazonaws.com/`
    );
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