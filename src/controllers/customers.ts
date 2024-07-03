import {Request, Response} from "express";
import prisma from "../database";
import {generateResponse} from "../services/config";

export const viewCustomers = async (req:Request, res:Response) => {
    const user:any = req.user,
        page = parseInt(<string>req.query.page) || 1,
        limit = parseInt(<string>req.query.limit) || 4,
        skip = (page - 1) * limit;

    console.log(user, 'user')

    const customers = await prisma.customers.findMany({
        where: {
            user_id: user.id
        },
        skip: skip,
        take: limit
    })

    const totalPages = Math.ceil(customers.length / limit)

    console.log(totalPages, 'customers')

    if (customers.length > 0) {
        return res.json(generateResponse('success', 'Customers retrieved successfully', {
            customers: customers,
            totalPages: totalPages,
            currentPage: page,
            limit: limit
        }));
    }

    return res.status(500).json(generateResponse('error', 'Customers not found', null))

}

