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


const publicRouter = Router();


publicRouter.post('/auth/register', registrationValidation,  createUser)
publicRouter.post('/auth/login', loginValidation, loginUser)
publicRouter.post('/auth/password/forgot', passwordForgotValidation, forgotPassword)
publicRouter.get('/auth/password/otp/:token', passwordForgotOtpValidation, forgotPasswordOtp)
publicRouter.post('/auth/password/reset', passwordResetValidation, resetPassword)
publicRouter.get('/profile', passport.authenticate('jwt', {session: false}), userProfile)






export default publicRouter