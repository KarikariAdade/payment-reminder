import {body} from "express-validator";

export const validateCustomerData:any = (type:string) => {

    const createValidation = [
        body('name').notEmpty().withMessage('Name field is required'),
        body('email').notEmpty().withMessage('Email field is required')
            .isEmail().withMessage('Invalid email address'),
        body('phone').notEmpty().withMessage('Phone field is required'),
        body('address').notEmpty().withMessage('Address field is required'),
    ];
    if (type === 'create'){
        return createValidation;
    }

    const customer_id_validation = [
        body('customer_id').notEmpty().withMessage('Customer ID field is required')
    ];

    return createValidation.concat(customer_id_validation)
}


export const validateCustomerId:any = () => {
    return body('customer_id').notEmpty().withMessage('Customer ID field is required')
}