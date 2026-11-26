import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api_response.js";
import { ApiError } from "../utils/api_error.js";
import { asyncHandler } from "../utils/async_handler.js";
import { forgotPasswordMailgenContent, sendEmail } from "../utils/mail.js";
import { emailVerificationMailgenContent } from "../utils/mail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";