import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "@/infrastructure/providers/loggers/logger";

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