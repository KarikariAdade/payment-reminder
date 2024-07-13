import {Request, Response} from "express";
import prisma from "../database";
import {generateResponse} from "../services/config";
import {logger} from "../services/logger";
import {randomUUID} from "node:crypto";

export const viewPayments = async (req: Request, res: Response) => {
    const user: any = req.user,
        page = parseInt(<string>req.query.page) || 1,
        limit = parseInt(<string>req.query.limit) || 4,
        skip = (page - 1) * limit;

    const payments = await prisma.payments.findMany({
        where: {
            user_id: user.id
        },
        skip: skip,
        take: limit
    })

    res.json(generateResponse('success', "Payments fetched successfully", payments));
}


export const createPayment = async (req: Request, res: Response) => {
    const user:any = req.user,
        {invoice_id, amount} = req.body

    const invoice = await prisma.invoices.findFirst({
        where: {
            id: invoice_id,
            user_id: user.id
        }
    })

    if (!invoice)
        return res.json(generateResponse('error', "Invoice not found", {}));

    try {

        const check_payments = await prisma.payments.aggregate({
           where: {
               invoice_id: invoice_id
           },
            _sum: {
               amount: true,
            }
        })

        if (check_payments._sum + amount > invoice.net_total)
            return res.status(400).json(generateResponse('error', `Payment amount exceeds invoice net total`, {}));

        prisma.$transaction(async (prisma) => {

            try {
                const payment = await prisma.payments.create({
                    data: {
                        invoice_id: invoice_id,
                        amount: amount,
                        user_id: user.id,
                        reference: randomUUID(),
                        status: 'success',
                    }
                })

                await prisma.invoices.update({
                    where: {
                        id: invoice_id,
                        user_id: user.id
                    },
                    data: {
                        amount_paid: invoice.amount_paid + amount,
                        payment_status: invoice.amount_paid + amount >= invoice.net_total? 'success' : 'pending'
                    }
                })
            } catch (errors) {

                logger.error('Could not close transaction', errors)

                return res.status(500).json(generateResponse('error', "Failed to create payment", {}));
            }

        })


        return res.json(generateResponse('success', "Payment created successfully", null));

    } catch (err) {

        logger.error(err)

        return res.status(500).json(generateResponse('error', "Failed to create payment", {}));
    }

}

export const updatePayment = async (req:Request, res:Response) => {

    const user:any = req.user,
        {payment_id, amount} = req.body

    try {
        const payment = await prisma.payments.findFirst({
            where: {
                id: payment_id,
                user_id: user.id
            }
        })

        if (!payment)
            return res.json(generateResponse('error', "Payment not found", {}));

        const invoice = await prisma.invoices.findFirst({
            where: {
                id: payment.invoice_id,
                user_id: user.id
            }
        })

        if (!invoice)
            return res.json(generateResponse('error', "Invoice not found", {}));

        prisma.$transaction(async (prisma) => {

            const updated_invoice  = await prisma.invoices.update({
                where: {
                    id: invoice.id,
                    user_id: user.id
                },
                data: {
                    amount_paid: (invoice.amount_paid - payment.amount) + amount,
                    payment_status: (invoice.amount_paid - payment.amount) + amount >= invoice.net_total? 'success' : 'pending'
                }
            })

            await prisma.payments.update({
                where: {
                    id: payment_id,
                    user_id: user.id
                },
                data: {
                    amount: amount,
                    status: 'success'
                }
            })

        })

        return res.json(generateResponse('success', "Payment updated successfully", null));

    } catch (errors) {
        logger.error('Could not update payment', errors)

        return res.status(500).json(generateResponse('error', "Failed to update payment", {}));
    }



}

export const deletePayment = async (req: Request, res: Response) => {
    const user:any = req.user,
        {payment_id} = req.body

    try {
        const payment = await prisma.payments.findFirst({
            where: {
                id: payment_id,
                user_id: user.id
            }
        })

        if (!payment)
            return res.json(generateResponse('error', "Payment not found", {}));

        prisma.$transaction(async (prisma) => {
            const invoice = await prisma.invoices.findFirst({
                where: {
                    id: payment.invoice_id,
                    user_id: user.id
                }
            })

            await prisma.payments.delete({
                where: {
                    id: payment_id,
                    user_id: user.id
                }
            })

            await prisma.invoices.update({
                where: {
                    id: payment.invoice_id,
                    user_id: user.id
                },
                data: {
                    amount_paid: invoice.amount_paid - payment.amount,
                    payment_status: invoice.amount_paid - payment.amount > 0 ? 'pending' : 'success'
                }
            })
        })

        return res.json(generateResponse('success', "Payment deleted successfully", null));

    } catch (err) {
        logger.error('Could not delete payment', err)

        return res.status(500).json(generateResponse('error', "Failed to delete payment", {}));
    }
}

export const initiatePaymentRequest = async (req: Request, res: Response) => {
    return res.json(generateResponse('success', 'hel', null))
}