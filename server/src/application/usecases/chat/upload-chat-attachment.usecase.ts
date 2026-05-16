import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";
import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";

export interface UploadChatAttachmentResponse {
  attachmentUrl: string;
  attachmentType: "image" | "video" | "audio" | "file";
}

export class UploadChatAttachmentUseCase implements IBaseUseCase<Record<string, unknown>, UploadChatAttachmentResponse, UploadFileDTO> {
  constructor(private readonly _storageProvider: IStorageProvider) {}

  async execute(_dto: Record<string, unknown>, file: UploadFileDTO): Promise<UploadChatAttachmentResponse> {
    const attachmentUrl = await this._storageProvider.uploadChatAttachment(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    let attachmentType: "image" | "video" | "audio" | "file" = "file";
    if (file.mimetype.startsWith("image/")) attachmentType = "image";
    else if (file.mimetype.startsWith("video/")) attachmentType = "video";
    else if (file.mimetype.startsWith("audio/")) attachmentType = "audio";

    return {
      attachmentUrl,
      attachmentType,
    };
  }
}
