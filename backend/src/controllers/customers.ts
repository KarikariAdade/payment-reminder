import {Request, Response} from "express";
import prisma from "../database";
import {generateResponse} from "../services/config"

export const viewCustomers = async (req:Request, res:Response) => {
    const user:any = req.user,
        page = parseInt(<string>req.query.page) || 1,
        limit = parseInt(<string>req.query.limit) || 4,
        skip = (page - 1) * limit;

    const customers = await prisma.customers.findMany({
        where: {
            user_id: user.id
        },
        skip: skip,
        take: limit
    })

    const totalPages = Math.ceil(customers.length / limit)

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

export const createCustomer = async (req:Request, res:Response) => {
    const user:any = req.user,
        {name,email,phone,address} = req.body

    try {
        const checkCustomer = await prisma.customers.findUnique({
            where: {
                email: email
            }
        })

        if (checkCustomer)
            return res.status(400).json(generateResponse('error', 'Customer with this email already exists', null))

        const customer = await prisma.customers.create({
            data: {
                name: name,
                email: email,
                phone: phone,
                address: address,
                user_id: user.id
            }
        })

        return res.json(generateResponse('success', 'Customer created successfully', customer))

    } catch (err) {

        return res.status(500).json(generateResponse('error', 'Error while creating customer', err))

    }

}

export const updateCustomer = async (req:Request, res:Response) => {
    const user:any = req.user,
        {name, email, phone, customer_id, address} = req.body

    const customer = await prisma.customers.findFirst(
        {
            where: {
                id: customer_id,
                user_id: user.id,
            }
        }
    )
    const customerEmailChecker = await prisma.customers.findFirst({
        where: {
            email: email,
            id: { not: customer_id }
        }
    })

    if (customerEmailChecker)
        return res.status(400).json(generateResponse('error', 'Customer with this email already exists', null))

    if (customer){
        try {
            await prisma.customers.update({
                where: {
                    id: customer_id,
                    user_id: user.id
                },
                data: {
                    name: name,
                    email: email,
                    phone: phone,
                    address: address
                }
            })

            return res.json(generateResponse('success', 'Customer updated successfully', customer))

        } catch (err) {

            return res.status(500).json(generateResponse('error', 'Error while updating customer', err))

        }
    }

    return res.status(404).json(generateResponse('error', 'Customer not found', null))
}

export const customerDetails = async (req: Request, res: Response) => {

    const user:any = req.user,
        customer_id = req.body.customer_id

    const customer =  await prisma.customers.findUnique({
        where: {
            id: customer_id,
            user_id: user.id
        }
    })

    if (customer)
        return res.json(generateResponse('success', 'Customer retrieved successfully', customer))

    return res.status(404).json(generateResponse('error', 'Customer not found', null))

}

export const deleteCustomer = async (req: Request, res: Response) => {
    const user:any = req.user,
        customer_id = req.body.customer_id

    const customer =  await prisma.customers.findUnique({
        where: {
            id: customer_id,
            user_id: user.id
        }
    })

    if (customer) {
        try {
            await prisma.customers.delete({
                where: {
                    id: customer_id,
                    user_id: user.id
                }
            })

            return res.json(generateResponse('success', 'Customer deleted successfully', null))

        } catch (err) {

            return res.status(500).json(generateResponse('error', 'Error while deleting customer', err))

        }
    }

    return res.status(404).json(generateResponse('error', 'Customer not found', null))
}