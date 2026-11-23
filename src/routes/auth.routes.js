import { Router } from "express";
import {
  login,
  logoutUser,
  registerUser,
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  getCurrentUser,
  ChangeCurrentPassword,
  resendEmailVerfication,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validator.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
} from "../validators/index.js";

const router = Router();

//unsecured routes
router.route("/register").post(userRegisterValidator(), validate, registerUser);

router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verfiy-email/:verficationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
  .route("/reset-password/:resetToken")
  .post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

//secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    ChangeCurrentPassword,
  );

router.route("/resend-email-verification").post(verifyJWT, resendEmailVerfication);

export default router;