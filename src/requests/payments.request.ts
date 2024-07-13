import {body} from "express-validator";

export const validatePaymentData:any = (type:string) => {
    const validateCreatePayment = [
        body('invoice_id').notEmpty().withMessage('Invoice ID field is required'),
        body('amount').notEmpty().withMessage('Amount field is required').isFloat().withMessage('Amount should be a floating point number'),
    ]

    const validateUpdatePayment = [
        body('payment_id').notEmpty().withMessage('Payment ID field is required'),
        body('amount').notEmpty().withMessage('Amount field is required').isFloat().withMessage('Amount should be a floating point number')
    ]

    if (type === 'create')
        return validateCreatePayment
    else
        return validateUpdatePayment
}

export const validatePaymentId:any = () => {
    return body('payment_id').notEmpty().withMessage('Payment ID field is required')
}

export const initPaymentValidation:any = () => {
    return [
        body('customer_id').notEmpty().withMessage('Customer ID field is required'),
        body('amount').notEmpty().withMessage('Amount field is required')

    ]
}

export const validatePaymentRequest:any = () => {
    return body('invoice_id').notEmpty().withMessage('Invoice ID field is required')
}