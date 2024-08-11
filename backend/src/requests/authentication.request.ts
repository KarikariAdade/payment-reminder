import {body} from "express-validator";

export const registrationValidation:any = [
    body('name').notEmpty().withMessage('Name field is required'),
    body('email').notEmpty().withMessage('Email field is required')
        .isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password field is required')
        .isStrongPassword().withMessage('Password is required and must be strong'),
    body('confirmPassword').notEmpty().withMessage('Password Confirmation field is required')
        .custom((value, { req }) => value === req.body.password).withMessage('Passwords must match'),
];

export const loginValidation:any = [
    body('email').notEmpty().withMessage('Email field is required')
        .isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password field is required')
]

export const passwordForgotValidation:any = [
    body('email').notEmpty().withMessage('Email field is required')
        .isEmail().withMessage('Invalid email address'),
]

export const passwordForgotOtpValidation: any = [
    body('otp').notEmpty().withMessage('Otp field is required')
];

export const passwordResetValidation:any = [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').notEmpty().withMessage('Password field is required')
        .isStrongPassword().withMessage('Password is required and must be strong'),
    body('confirmPassword').notEmpty().withMessage('Password Confirmation field is required')
        .custom((value, { req }) => value === req.body.password).withMessage('Passwords must match'),
];