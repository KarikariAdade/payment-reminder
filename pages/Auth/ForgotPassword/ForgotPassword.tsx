import {ROUTES} from "../../../utils/routes.ts";
import {useNavigate} from "react-router-dom";

export const ForgotPassword = () => {

    const navigate = useNavigate()

    return (
        <>

                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Password Reset</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" action="#" method="POST">
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password"
                                           className="block text-sm/6 font-medium text-gray-900">Email</label>
                                    <div className="text-sm">
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input type="email" name="email" id="email" autoComplete="email" required
                                           className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                                </div>
                                <p className="mt-10 text-center text-sm/6 text-gray-500">
                                    Remembered your Password?
                                    <span onClick={() => navigate(ROUTES.SIGNIN)}
                                          className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Sign In
                        </span>

                                </p>
                            </div>

                            <div>
                                <button type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Reset
                                    Password
                                </button>
                            </div>
                        </form>


                    </div>
                </div>

        </>
    )

}