import {toast} from "react-toastify";

export const validEmail = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
);
export const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');

export const displayMessage = (type, message) => {

    if (type === 'error') {
        toast.error(message.response.data.message ?? message.response.data.errors[0].msg)
    }

    if (type === 'success') {
        toast.success(message)
    }

}