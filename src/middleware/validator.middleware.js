import { validationResult } from "express-validator";
import { ApiError } from "../utils/api_error.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();               // if this line is missing, the request hangs
  }

  const extractedErrors = errors.array().map((err) => ({ [err.path]: err.msg }));
  throw new ApiError(422, "Received data is not valid", extractedErrors);
};