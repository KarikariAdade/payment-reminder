import bcrypt from 'bcrypt'
import nodemailer, {SentMessageInfo} from 'nodemailer'
import Mail from "nodemailer/lib/mailer";

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