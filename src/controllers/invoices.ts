import {Request, Response} from "express";
import prisma from "../database";
import {generateResponse} from "../services/config";

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

    const user = req.user,
        invoiceData = req.body

}