import {Request, Response} from "express";
import prisma from "../database";
import {generateResponse} from "../services/config";
import {logger} from "../services/logger";
import {randomUUID} from "node:crypto";
import {emailQueue} from "../queues/queue.setup";
import * as crypto from "node:crypto";
import axios from "axios";

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
    const invoice_id = req.params.invoice_id;

    const invoice = await prisma.invoices.findFirst({
        where: {
            id: parseInt(invoice_id),
        },
        include: {
            Customers: true
        }
    })

    if (!invoice)
        return res.send('invoice not found')

    const amount_remaining = invoice.net_total - invoice.amount_paid,
        reference = randomUUID();

    if (amount_remaining <= 0)
        return res.send('Invoice already paid. Thank you')



    const payment = await prisma.payments.create({
        data: {
            invoice_id: invoice.id,
            user_id: invoice.user_id,
            amount: amount_remaining,
            reference: reference,
            status: 'pending'
        }
    })

    const payment_data = {
        amount: payment.amount * 100,
        reference: reference,
        email: invoice.Customers.email,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        orderID: randomUUID() + '-' + invoice.id
    }

    const response = await axios.post(process.env.PAYSTACK_PAYMENT_URL, payment_data, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (response.data.status) {
            console.log(response.data)
            return res.redirect(response.data.data.authorization_url)
        }else{
            logger.error(response)
            return res.send('Payment Error, could not prepare payment request')
        }
    }).catch(err => {
        logger.error(err)
        return res.send('Payment Error')
    })
}

export const sendPaymentRequest = async (req: Request, res: Response) => {
    const user:any = req.user,
        invoice_id = req.body.invoice_id

    const invoice = await prisma.invoices.findFirst({
        where: {
            id: invoice_id,
            user_id: user.id,
            payment_status: 'pending'
        },
        include: {
            Customers: true
        }
    })

    if (!invoice)
        return res.json(generateResponse('error', "Invoice not found or payment has already been made", {}));

    const amount_remaining = invoice.net_total - invoice.amount_paid

    if (amount_remaining <= 0)
        return res.json(generateResponse('error', "Payment has already been made", {}));

    try {

        const protocol = req.protocol,
            hostname = req.hostname,
            payment_link = process.env.NODE_ENV !== 'production' ? `${protocol}://${hostname}:${process.env.PORT}/api/payments/init/${invoice.id}` : `${protocol}://${hostname}/api/payments/init/${invoice.id}`

        await emailQueue.add('sendEmail', {
            to: user.email,
            subject: "Invoice Payment Request",
            template: "payment_request",
            context: {
                name: invoice.Customers.name,
                username: user.name,
                invoice_number: invoice.invoice_number,
                amount: amount_remaining,
                payment_link: payment_link
            }
        }, {removeOnComplete: true})

        return res.json(generateResponse('success', "Payment request sent successfully", null));

    } catch (errors) {
        logger.error('Could not send payment request', errors)

        return res.status(500).json(generateResponse('error', "Failed to send payment request", {}));
    }



}

export const paymentCallback = async (req: Request, res: Response) => {
    const trxref = req.query.trxref,
        reference:any = req.query.reference;


    if (trxref === null || reference === null) {
        logger.error('Could not find callback parameters', req.params)
        return res.send("Invalid callback parameters");
    }

    console.log(trxref, reference)

    console.log('url', `${process.env.PAYSTACK_VERIFY_URL}/${reference}`)

    const response = await axios.get(`${process.env.PAYSTACK_VERIFY_URL}${reference}`, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (response.data.status) {
                const response_data = response.data.data

                prisma.$transaction(async (prisma) => {
                    const payment = await prisma.payments.findFirst({
                        where: {
                            reference: reference
                        }
                    })

                    if (payment) {
                        if (response_data.status === 'success') {

                             await prisma.payments.update({
                                 where: {
                                     id: payment.id
                                 },
                                 data: {
                                     status: response_data.status
                                 }
                             })

                        }else {
                            await prisma.payments.update({
                                where: {
                                    id: payment.id
                                },
                                data: {
                                    status: 'failed'
                                }
                            })
                        }
                    }
                })

            }
        }).catch(err => {
            console.log(err.toString(), 'callback error')
        })

}