import {Request, Response} from "express";
import prisma from "../database";
import {generateResponse} from "../services/config";
import {logger} from "../services/logger";

export const viewTaxes = async (req:Request, res:Response) => {
    const user:any = req.user

    const taxes = await prisma.taxes.findMany({
        where: {
            user_id: user.id
        }
    });

    return res.json(generateResponse('success', 'Taxes retrieved successfully', taxes))
}

export const createTax = async (req:Request, res:Response) => {
    const user:any = req.user,
        {name, type, amount} = req.body

    logger.info(user)
    try {

        const checkTax = await prisma.taxes.findFirst({
            where: {
                name: name,
                user_id: user.id
            }
        })

        if (checkTax)
            return res.status(400).json(generateResponse('error', 'Tax with the same name already exists', null))

        const newTax = await prisma.taxes.create({
            data: {
                name: name,
                type: type,
                amount: amount,
                user_id: user.id
            }
        });

        return res.json(generateResponse('success', 'Tax created successfully', newTax))

    } catch (err) {
        logger.info(err)
        console.log(err, 'error while creating taxes')
        return res.status(500).json(generateResponse('error', 'Error while creating taxes', err))
    }

}

export const updateTax = async (req:Request, res:Response) => {
    const user:any = req.user,
        {tax_id, name, type, amount} = req.body

    try {

        const checkTax = await prisma.taxes.findFirst({
            where:{
                name: name,
                user_id: user.id,
                id: {not: tax_id}
            },
        })

        if (checkTax)
            return res.status(400).json(generateResponse('error', 'Tax with the same name already exists', null))

        const updatedTax = await prisma.taxes.update({
            where: {
                id: tax_id,
                user_id: user.id
            },
            data: {
                name: name,
                type: type,
                amount: amount
            }
        });

        return res.json(generateResponse('success', 'Tax updated successfully', updatedTax))

    } catch (err) {
        console.log(err, 'error while updating taxes')
        return res.status(500).json(generateResponse('error', 'Error while updating taxes', err))
    }
}


export const deleteTax = async (req:Request, res: Response) => {
    const user:any = req.user,
        {tax_id} = req.body

    try {

        await prisma.taxes.delete({
            where: {
                id: tax_id,
                user_id: user.id
            }
        });

        return res.json(generateResponse('success', 'Tax deleted successfully', null))

    } catch (err) {
        console.log(err, 'error while deleting taxes')
        return res.status(500).json(generateResponse('error', 'Error while deleting taxes', err))
    }
}