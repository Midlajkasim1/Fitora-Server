
export class ApiResponse<T> {
  public success: boolean;
  public message?: string;
  public data?: T;

  constructor(success: boolean, message?: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse(false, message);
  }
}