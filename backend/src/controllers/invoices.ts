import {Request, Response} from "express";
import prisma from "../database";
import {generateInvoiceNumber, generateResponse, generatePdf, generateDate} from "../services/config";
import path from "path";
import * as fs from "node:fs";
import {emailQueue} from "../queues/queue.setup";

export const viewInvoices = async (req: Request, res: Response) => {
    const user:any = req.user,
        page = parseInt(<string>req.query.page) || 1,
        limit = parseInt(<string>req.query.limit) || 4,
        skip = (page - 1) * limit;

    const invoices:any = await prisma.invoices.findMany({
        where: {
            user_id: user.id
        },
        include: {
            Customers: true,
            InvoiceItems: true
        },
        skip: skip,
        take: limit
    })

    if (!invoices) {
        return res.status(404).json(generateResponse('error', 'Invoices not found', null))
    }

    res.json(generateResponse('success', 'Invoices retrieved successfully', invoices))
}

export const createInvoice = async (req: Request, res: Response) => {

    const user:any = req.user
    const invoiceData = req.body
    const invoiceNumber = await generateInvoiceNumber();

    let invoice_item_list = [];

    try {
        const checkCustomer = await prisma.customers.findFirst({
            where: {
                id: invoiceData.customer_id,
                user_id: user.id
            }
        })

        let invoice_generatedData:any =  generateInvoiceData(invoiceData, user.id, invoiceNumber);

        if (!checkCustomer)
            return res.status(404).json(generateResponse('error', 'Customer not found', null))

        if (invoiceData.invoiceItems.length < 1)
            return res.status(400).json(generateResponse('error', 'Invoice items cannot be empty', null))

        prisma.$transaction(async (prisma) => {
            try {
                const invoice  = await prisma.invoices.create({
                    data: invoice_generatedData
                })

                invoiceData.invoiceItems.forEach(invoiceItem => invoice_item_list.push({
                    invoice_id: invoice.id,
                    item_name: invoiceItem.item_name,
                    price: invoiceItem.price,
                    quantity: invoiceItem.quantity
                }))

                await prisma.invoice_Items.createMany({
                    data: invoice_item_list
                })

            } catch (errors) {

                console.error('Could not close transaction', errors)

            }
        } )


        return res.json(generateResponse('success', 'Invoice items saved', null))

    } catch (err) {

        return res.status(500).json(generateResponse('error', 'Error while creating customer', err))

    }

}

export const invoiceDetails = async (req: Request, res: Response) => {

    const user: any = req.user,
        invoice_id = req.body.invoice_id;

    const invoice = await prisma.invoices.findFirst({
        where: {
            id: invoice_id,
            user_id: user.id
        },
        include: {
            Customers: true,
            InvoiceItems: true,
            Payments: true
        }
    })

    if (invoice)
        return res.json(generateResponse('success', 'Invoice retrieved successfully', invoice))
    else
        return res.status(500).json(generateResponse('error', 'Invoice not found', null))

}

export const updateInvoice = async (req:Request, res: Response) => {

    try {
        const user:any = req.user,
            invoice_data = req.body;

        const selected_invoice:any = await prisma.invoices.findFirst({
            where: {
                user_id: user.id,
                id: invoice_data.invoice_id
            },
            include: {
                InvoiceItems: true
            }
        })

        if (!selected_invoice)
            return res.status(404).json(generateResponse('error', 'Invoice not found', null))

        let invoice_generatedData:any =  generateInvoiceData(invoice_data, user.id, selected_invoice.invoice_number),
            invoice_item_list = []

        await prisma.invoice_Items.deleteMany({
            where: {
                invoice_id: selected_invoice.id
            }
        })

        prisma.$transaction(async (prisma) => {
            try {
                const invoice:any  = await prisma.invoices.update({
                    where:{
                        id: selected_invoice.id
                    },
                    data: invoice_generatedData
                })

                invoice_data.invoiceItems.forEach(invoiceItem => invoice_item_list.push({
                    invoice_id: invoice.id,
                    item_name: invoiceItem.item_name,
                    price: invoiceItem.price,
                    quantity: invoiceItem.quantity
                }))

                await prisma.invoice_Items.createMany({
                    data: invoice_item_list
                })

            } catch (errors) {

                console.error('Could not close transaction', errors)

            }
        } )

        return res.json(generateResponse('success', 'Invoice updated successfully', null))
    } catch (errors) {
        return res.status(500).json(generateResponse('error', 'Invoice updated successfully', null))

    }

}

export const deleteInvoice = async (req: Request, res: Response) => {

    const user: any = req.user,
        invoice_id = req.body.invoice_id;

    prisma.$transaction(async (prisma) => {
        try {

            const invoiceItems = await prisma.invoice_Items.deleteMany({
                where: {
                    invoice_id: invoice_id
                }
            })

            if (invoiceItems) {
                await prisma.invoices.delete({
                    where:{
                        id: invoice_id,
                        user_id: user.id
                    }
                })
            }
        } catch (errors) {

            console.error('Could not close transaction', errors)

            return res.status(500).json(generateResponse('error', 'Invoice could not be deleted', null))

        }
    })

    return res.json(generateResponse('success', 'Invoice deleted successfully', null))
}

export const sendInvoiceEmail = async (req:Request, res: Response) => {

    const invoice_id = req.body.invoice_id,
        user:any = req.user

    const invoice:any = await prisma.invoices.findFirst({
        where: {
            user_id: user.id,
            id: invoice_id
        },
        include: {
            Customers: true,
            InvoiceItems: true
        }
    })

    if (!invoice)
        return res.status(404).json(generateResponse('error', 'Invoice not found', null))

    const invoice_template_data = {
        invoice: invoice,
        invoiceDate: generateDate(invoice.created_at),
        customer: invoice.Customers,
        invoiceItems: invoice.InvoiceItems
    }

    try {

        const absolute_template_path = path.resolve(__dirname, '../templates/invoice.hbs')

        if (!fs.existsSync(absolute_template_path))
            return res.status(404).json(generateResponse('error', 'Invoice template not found', null))

        const pdfPath = path.join(__dirname, `../${invoice.invoice_number}.pdf`),
            pdf = await generatePdf(absolute_template_path, invoice_template_data, pdfPath)

        if (pdf) {
            await emailQueue.add('sendEmail', {
                to: invoice.Customers.email,
                subject: `Invoice ${invoice.invoice_number}`,
                template: "invoice_email",
                context: invoice_template_data,
                attachments: [{
                    filename: `${invoice.invoice_number}.pdf`,
                    path: pdfPath,
                    contentType: 'application/pdf'
                }]
            })

            return res.json(generateResponse('success', 'Email sent successfully', null))
        }

        return res.status(500).json(generateResponse('error', 'Email could not be send. Kindly try again', null))

    } catch (err) {

        console.error('Error sending email', err)

        return res.status(500).json(generateResponse('error', 'Email could not be send. Kindly try again', null))
    }

}

const generateInvoiceData = (data:any, user:number, invoice_number:string) => {
    return {
        user_id: user,
        customer_id: data.customer_id,
        discount_amount: data.discount_amount ?? 0,
        discount_total: data.discount_total ?? 0,
        discount_type: data.discount_type ?? null,
        amount_paid: data.amount_paid ?? 0,
        invoice_number: invoice_number,
        net_total: data.net_total ?? 0,
        payment_due: data.payment_due !== null ? data.payment_due : null,
        payment_status: data.payment_status ?? 'pending',
        sub_total: data.sub_total ?? 0,
        tax_total: data.tax_total ?? 0,
        taxes: data.taxes,

    }

}