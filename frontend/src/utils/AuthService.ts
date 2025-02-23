import {validEmail} from "/src/utils/Reusables.ts";

export const validateFields = (signUpState, setErrors) => {

    let newErrors = {name: '', email: '', password: '', confirmPassword: ''},
        hasErrors = false;

    if (signUpState.name.trim().length < 3) {
        newErrors.name = 'Name must be at least 3 characters long'
        hasErrors = true
    }

    if (signUpState.password.trim().length < 8) {
        newErrors.password = 'Password too short'
        hasErrors = true
    }

    if (signUpState.password !== signUpState.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
        hasErrors = true
    }

    if (!validEmail.test(signUpState.email)) {
        newErrors.email = "Invalid email address"
        hasErrors = true
    }

    setErrors(newErrors)

    return hasErrors;

}