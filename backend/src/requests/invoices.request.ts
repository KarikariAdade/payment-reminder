import {body} from "express-validator";

export const validateInvoiceData:any = (type:string) => {
    const createValidation = [
        body('customer_id').notEmpty().withMessage('Customer ID field is required'),
        body('sub_total').notEmpty().withMessage('Sub Total field is required').isFloat().withMessage('Sub Total should be a floating point number'),
        body('net_total').notEmpty().withMessage('Net Total field is required').isFloat().withMessage('Sub Total should be a floating point number'),
        body('taxes').notEmpty().withMessage('Taxes field is required'),
        body('invoiceItems').notEmpty().withMessage('Invoice Items are required')
    ];

    const invoiceValidation = [body('invoice_id').notEmpty().withMessage('Invoice ID field is required')]
    if (type === 'create') {
        return createValidation;
    }
    return createValidation.concat(invoiceValidation);
}

export const validateInvoiceId:any = () => {
    return body('invoice_id').notEmpty().withMessage('Invoice ID field is required')
}