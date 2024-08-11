import {body} from "express-validator";

export const validateTaxData:any = (type:string) => {

    const createValidation = [
        body('name').notEmpty().withMessage('Tax Name field is required'),
        body('type').notEmpty().withMessage('Type field is required'),
        body('amount').notEmpty().withMessage('Amount field is required').isFloat().withMessage('Amount should be a floating point number')
    ]

    const updateValidation = [
        body('tax_id').notEmpty().withMessage('Tax ID field is required')
    ];

    if (type === 'create')
        return createValidation;
    else
        return createValidation.concat(updateValidation)

}

export const validateTaxId:any = () => {
    return body('tax_id').notEmpty().withMessage('Tax ID field is required')
}