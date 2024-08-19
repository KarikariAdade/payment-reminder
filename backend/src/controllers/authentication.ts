import prisma from '../database'
import jwt from 'jsonwebtoken'
import {Request, Response} from "express";
import {generateResponse, hashPassword} from "../services/config";
import {randomUUID} from "node:crypto";
import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import {sendEmail} from "../services/mailconfig";
import {emailQueue} from "../queues/queue.setup";

export const createUser = async (req:Request, res:Response) => {

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty())
        return res.status(401).json(generateResponse('error', 'validation errors', validationErrors.array()))

    try {

        const uuid:string = randomUUID()

        const existingUser = await prisma.users.findUnique({
            where: {
                email: req.body.email
            }
        })

        if (!existingUser) {

            const user = await prisma.users.create({
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: await hashPassword(req.body.password),
                    uuid: uuid
                }
            })

            return res.json(generateResponse('success', 'User created successfully', user))

        }else {

            return res.status(401).json(generateResponse('error', "Email already exists. If you're the owner of the account, kindly log in.", null))

        }

    } catch (err) {
        console.log(err)
        return res.status(401).json({error: err})

    }

}

export const loginUser = async (req: Request, res: Response) => {

    try {
        const {email, password} = req.body,
            jwtSecret:any = process.env.JWT_SECRET

        const user = await prisma.users.findUnique({where: {email}})

        if (!user)
            return res.status(401).json(generateResponse('error', 'User not found', null))

        const isMatch:boolean = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(401).json(generateResponse('error', 'Invalid credentials', null))

        const payload = {id: user.id, uuid: user.uuid},
            token = jwt.sign(payload, jwtSecret, {expiresIn: '1D'})

        res.json(generateResponse('success', 'User logged in successfully', {user: user, token: token}))

    } catch (err) {

        res.status(401).json(generateResponse('error', 'Error while login', err))
    }

}

export const forgotPassword = async (req: Request, res: Response) => {

    try {
        const email:string = req.body.email,
            user:any = await prisma.users.findUnique({
                where: {
                    email: email
                }
            })

        if (user) {

            const otp:number = Math.floor(1000 + Math.random() * 9000),
                expiration:Date = new Date(new Date().getTime() + 15 * 60000)

            const passwordReset:any = await prisma.password_Resets.create({
                data: {
                    user_id: user.id,
                    otp: otp.toString(),
                    expiration: expiration
                }
            })

            if (passwordReset) {
                console.log("OTP sent to", user.email, "is", otp)

                await emailQueue.add('sendEmail', {
                    to: user.email,
                    subject: "Password Reset Email",
                    template: "accountCreationTemplate",
                    context: {
                        name: user.name,
                        otp: otp,
                        expiration: expiration.toISOString().slice(0, 19).replace('T','')
                    }
                }, {removeOnComplete: true})

                return res.json(generateResponse('success', 'Password reset email sent successfully', {user: user, reset: passwordReset, url: process.env.BASE_URL+`/api/auth/password/otp/${passwordReset.token}`}))
            }

            return res.status(401).json(generateResponse('error', 'Password reset could not be initiated.Kindly try again', null))

        }

        return res.status(401).json(generateResponse('error', 'User not found', null))
    } catch (error) {
        console.error("error:", error)
        return res.status(401).json(generateResponse('error', 'Error while sending password reset email', error))
    }

}

export const userProfile = async (req:Request, res:Response) => {

    const requestUser: any = req.user;

    try {

        const user:any = await prisma.users.findUnique({where: {id: requestUser.id}})

        if (!user) {
            res.status(401).json(generateResponse('error', 'User not found', null))
        }

        res.json(generateResponse('success', 'User profile fetched successfully', user))

    } catch (err) {
        console.log(err)
        return res.status(401).json({error: err})
    }

}

export const resetPassword = async (req: Request, res: Response) => {

    const {password, confirmPassword} = req.body,
        token = req.params.token

    if (token === '' || token === null)
        return res.status(401).json(generateResponse('error', "Token missing", null));

    try {
        const passwordReset:any = await prisma.password_Resets.findFirst({
            where: {
                token: token,
                is_used: false,
            }
        })

        if (!passwordReset)
            return res.status(401).json(generateResponse('error', "Invalid or expired token", null));

        const user = await prisma.users.findUnique({
            where: {
                id: passwordReset.user_id
            }
        })

        if (!user)
            return res.status(401).json(generateResponse('error', "User not found", null));

        const newPassword = await hashPassword(password);

        const updatedUser = await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                password: newPassword
            }
        })

        if (!updatedUser)
            return res.status(401).json(generateResponse('error', "Error while resetting password. Kindly try again", null));

        return res.json(generateResponse('success', 'Password updated successfully', null));
    } catch (errors) {
        return res.status(401).json(generateResponse('error', 'Password could not be updated', null))
    }
    
}

export const forgotPasswordOtp = async (req: Request, res: Response) => {

    const token = req.params.token,
        otp = req.body.otp

    if (token === '' || token === null)
        return res.status(500).json(generateResponse('error', "Token missing", null));

    const passwordReset:any = await prisma.password_Resets.findFirst({
        where: {
            token: token,
            otp: otp,
            expiration: {gt: new Date()},
            is_used: false
        }
    })

    if (!passwordReset)
        return res.status(401).json(generateResponse('error', "Invalid OTP or expired token", null));

    return res.status(200).json(generateResponse('success', "Password reset found", passwordReset))

}