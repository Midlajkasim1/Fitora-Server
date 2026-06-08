import { CustomError } from "./custom.error";
import { HttpStatus } from "@/domain/constants/http.status.constants";

export class ForbiddenError extends CustomError {
  constructor(message = "Access forbidden: you do not own this resource") {
    super(message, HttpStatus.FORBIDDEN);
  }
}
