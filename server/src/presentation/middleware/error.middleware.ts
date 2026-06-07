import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "@/infrastructure/providers/loggers/logger";
import { CustomError } from "@/shared/errors/custom.error";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let message = "Internal Server Error";
  let statusCode = 500;

  if (err instanceof ZodError) {
    message = err.issues[0]?.message || "Validation error";
    statusCode = 400;
  } 
  else if (err instanceof CustomError) {
    message = err.message;
    statusCode = err.statusCode;
  }
  else if (err && typeof err === "object" && "statusCode" in err && typeof (err as any).statusCode === "number") {
    message = (err as any).message || message;
    statusCode = (err as any).statusCode;
  }
  else if (err instanceof Error) {
    message = err.message;
  }

  logger.error(message, {
    stack: err instanceof Error ? err.stack : undefined,
  });

  return res.status(statusCode).json({
    success: false,
    message,
  });
};