import {Router} from "express";
import {
    loginValidation, passwordForgotOtpValidation,
    passwordForgotValidation,
    passwordResetValidation,
    registrationValidation
} from "../requests/authentication.request";
import {
    createUser,
    forgotPassword,
    forgotPasswordOtp,
    loginUser,
    resetPassword,
    userProfile
} from "../controllers/authentication";
import passport from 'passport'
import {initiatePaymentRequest} from "../controllers/payments";
import securedRoute from "./secured.route";
import {handleValidationErrors} from "../services/config";


const publicRouter = Router();


publicRouter.post('/auth/register', registrationValidation,  handleValidationErrors, createUser)
publicRouter.post('/auth/login', loginValidation, loginUser)
publicRouter.post('/auth/password/forgot', passwordForgotValidation, forgotPassword)
publicRouter.post('/auth/password/otp/:token', passwordForgotOtpValidation, forgotPasswordOtp)
publicRouter.post('/auth/password/reset', passwordResetValidation, resetPassword)
publicRouter.get('/profile', passport.authenticate('jwt', {session: false}), userProfile)






export default publicRouter