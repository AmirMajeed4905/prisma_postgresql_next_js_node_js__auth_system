// src/utils/apiResponse.ts
import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: object = {},
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    ...data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: object
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};