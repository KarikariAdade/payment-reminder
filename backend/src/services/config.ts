import bcrypt from 'bcrypt'
import {validationResult} from "express-validator";
import prisma from "../database";
import * as fs from "node:fs";
import pdf from 'html-pdf'
import * as crypto from "node:crypto";

import handlebars from "handlebars";

export const generateResponse = (type:string, message:string, data:any) => {

    if (type === 'success') {
        return {
            status: 200,
            message: message,
            data: data
        }
    }

    return {
        status: 401,
        message: message,
        data: data
    }
}

export const hashPassword = (password:string) => {
    return bcrypt.hash(password, 256)
}

export const comparePasswords = (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword)
}

export const generateDate = (selectedDate: Date, reverseToFormInput = false) => {

    const date = new Date(selectedDate);

    if (!reverseToFormInput) {
        const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


        const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const day: string = days[date.getDay()];
        const month: string = months[date.getMonth()];
        const year:number = date.getFullYear();

        const dayOfMonth:string = ('0' + date.getDate()).slice(-2);


        return `${day}, ${month} ${dayOfMonth}, ${year}`;
    } else {
        const date = new Date(selectedDate);


        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');


        return `${year}-${month}-${day}`;
    }
}

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array())
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
    }
    next();
};

export const generateInvoiceNumber = async () => {
    const invoiceNumber = await prisma.invoices.count(),
        nextInvoiceNumber = invoiceNumber + 1

    return `INV${nextInvoiceNumber.toString().padStart(5, '0')}`;
}

export let generatePdf = async (templatePath:string, templateData:any, outputPath:string)=> {
    return new Promise((resolve, reject) => {
        fs.readFile(templatePath, 'utf8', (err:any, data:any) => {
            if (err) {
                return reject(err)
            }

            const template = handlebars.compile(data)
            const htmlContent = template(templateData)

            pdf.create(htmlContent).toFile(outputPath, (err, res) => {
                if (err) return reject(err)
                resolve(res)
            })
        })
    })
}
