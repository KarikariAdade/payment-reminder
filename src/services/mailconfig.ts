import Mail from "nodemailer/lib/mailer";
import nodemailer, {SentMessageInfo} from "nodemailer";
import handlebars from "nodemailer-express-handlebars";
import path from "path";

export let emailTransporter:any = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
    }
} as any)

export let emailwithAttachment:any = nodemailer.createTransport({
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

export const sendEmail = async (to: string, subject: string, templateName:string, context: any): Promise<SentMessageInfo> => {

    const mailOptions = {
        from: process.env.MAILER_FROM_EMAIL,
        to: to,
        subject: subject,
        template: templateName,
        context: context
    }

    return new Promise((resolve, reject) => {
        emailTransporter.sendMail(mailOptions, (error:any, info:any) => {
            if (error) {
                console.log("Error sending email: ", error)
                reject(error)
            }else {
                console.log("Email sent: ", info.response)
                resolve(info)
            }
        })
    })

}
