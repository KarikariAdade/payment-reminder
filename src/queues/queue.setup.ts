import {Queue, Worker} from "bullmq";
import IORedis from "ioredis";
import nodemailer from "nodemailer";
import handlebars from "nodemailer-express-handlebars";
import path from "path";

const connection = new IORedis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
} as any)

const emailQueue = new Queue('emailQueue', {connection})

const emailTransporter:any = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
    }
} as any)

emailTransporter.use("compile", handlebars({
    viewEngine: {
        extname: ".hbs",
        partialsDir: path.join(__dirname, "../templates"),
        layoutsDir: path.join(__dirname, "../templates"),
        defaultLayout: "",
    },
    viewPath: path.join(__dirname, "../templates"),
    extName: ".hbs"
}))

const worker = new Worker('emailQueue', async job => {
    console.log("jobdata", job.data)
    const mailOptions:{} = {
        from: process.env.MAILER_FROM_EMAIL,
        to: job.data.to,
        subject: job.data.subject,
        template: job.data.template,
        context: job.data.context
    }

    await emailTransporter.sendMail(mailOptions)

}, {connection})

worker.on('failed', (job, err) => {
    console.error(`Failed job ${job.id}: ${err.message}`)
})

export {emailQueue, connection}