import {Router} from "express";
import {ChangeCurrentPassword, forgotPasswordRequest, getCurrentUser, refreshAccessToken, registerUser, resendEmailVerfication, resetForgotPassword, verifyEmail} from "../controllers/auth.controller.js";
import {login} from "../controllers/auth.controller.js";
import {logoutUser} from "../controllers/auth.controller.js";
import {validate} from "../middleware/validator.middleware.js"
import { userChangeCurrentPasswordValidator, userForgotPasswordValidator, userRegisterValidator } from "../validators/index.js";
import { userLoginValidator } from "../validators/index.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

//unsecured routes
router.route("/register").post (userRegisterValidator() , validate,registerUser);

router.route("/login").post(userLoginValidator() , validate ,login);
router.route("/verfiy-email/:verficationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotPasswordRequest);
router.route("/reset-password").post(userForgotPasswordValidator(), validate,forgotPasswordRequest);
router
   .route("/reset-password/:resetToken")
   .post(userForgotPasswordValidator(),validate,resetForgotPassword)
  



//secure routes
router.route("/logout").post(verifyJWT , logoutUser);
router.route("/current-user").post(verifyJWT,getCurrentUser);
router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(),validate,ChangeCurrentPassword);

router.route("/resend-email-verfication").post(verifyJWT,resendEmailVerfication);
   
export default router;