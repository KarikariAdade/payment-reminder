import {Input} from "/src/components/Input.tsx";
import React, {useState} from "react";
import {Button} from "/src/components/Button.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {routes} from "/src/utils/Routes.ts";
import {displayMessage, validEmail} from "/src/utils/Reusables.ts";
import axios from "axios";

export const ResetPassword = () => {

    const {token} = useParams(),
        navigate = useNavigate();

    console.log('this is the token', token)

    if (!token)
        navigate(routes.LOGIN)

    const [resetPasswordState, setResetPasswordState] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        token: token
    })

    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e) => {

        const {name, value} = e.target

        setErrors({...errors, [name]: ""});

        setResetPasswordState((prevData) => ({...prevData, [name]: value}))

    }

    const validateFields = () => {

        let newErrors = {name: '', email: '', password: '', confirmPassword: ''},
            hasErrors = false;


        if (resetPasswordState.password.trim().length < 8) {
            newErrors.password = 'Password too short'
            hasErrors = true
        }

        if (resetPasswordState.password !== resetPasswordState.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
            hasErrors = true
        }

        if (!validEmail.test(resetPasswordState.email)) {
            newErrors.email = "Invalid email address"
            hasErrors = true
        }

        setErrors(newErrors)

        return hasErrors;

    }

    const submitPasswordReset = async (e) => {
        e.preventDefault()

        setIsLoading(true)

        console.log('password reset', resetPasswordState, 'token', token)

        if (validateFields()) {
            setIsLoading(false)
            return false
        }

        await axios.post(`${import.meta.env.VITE_API_URL}/auth/password/reset`, resetPasswordState)
            .then((response) => {
                setIsLoading(false)
                console.log('response', response.data)
                displayMessage('success', response.data.message)
                navigate(routes.LOGIN)
            })
            .catch((errors) => {
                console.log('errors', errors)
                setIsLoading(false)
                displayMessage('error', errors)
            })


    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Reset Your Password
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                        <form className="space-y-6" action="#" method="POST" onSubmit={submitPasswordReset}>

                            <Input
                                type='email'
                                id='email'
                                label='Email Address'
                                placeholder='Email Address'
                                name='email'
                                classname='col-span-6 sm:col-span-4'
                                value={resetPasswordState.email}
                                onChange={handleInputChange}
                                errorMsg={errors.email}
                            />

                            <Input
                                type='password'
                                id='password'
                                label='Password'
                                placeholder='Password'
                                name='password'
                                classname='col-span-6 sm:col-span-4'
                                value={resetPasswordState.password}
                                onChange={handleInputChange}
                                errorMsg={errors.password}
                            />

                            <Input
                                type='password'
                                id='confirmPassword'
                                label='Confirm Password'
                                placeholder='Confirm Password'
                                name='confirmPassword'
                                classname='col-span-6 sm:col-span-4'
                                value={resetPasswordState.confirmPassword}
                                onChange={handleInputChange}
                                errorMsg={errors.confirmPassword}
                            />

                            <div>
                                <Button
                                    defaultText='Reset Password'
                                    btnClass='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                    type='submit'
                                    isLoading={isLoading}
                                    icon=''
                                />
                            </div>
                        </form>

                    </div>
                </div>
            </div>

        </>
    )

}