import './App.css'
import {Route, Routes} from "react-router-dom";
import {Login} from "/src/pages/auth/Login.tsx";
import {Register} from "/src/pages/auth/Register.tsx";
import {ForgotPassword} from "/src/pages/auth/ForgotPassword.tsx";
import {Dashboard} from "/src/pages/dashboard/Dashboard.tsx";
import {Bounce, ToastContainer} from "react-toastify";
import {Profile} from "/src/pages/profile/Profile.tsx";
import {RequireAuth} from "/src/components/RequireAuth.tsx";
import {ResetPassword} from "/src/pages/auth/ResetPassword.tsx";
import {NotFound} from "/src/pages/notfound/NotFound.tsx";
import {Customer} from "/src/pages/customer/Customer.tsx";
import {Taxes} from "/src/pages/taxes/Taxes.tsx";
import {Invoice} from "/src/pages/invoice/Invoice.tsx";
import {Payment} from "/src/pages/payment/Payment.tsx";


function App() {

    return (
        <>

            <Routes>
                <Route path='/auth'>
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>
                    <Route path='forgot/password' element={<ForgotPassword/>}/>
                    <Route path='reset/password/:token' element={<ResetPassword/>}/>
                </Route>

                <Route element={<RequireAuth/>}>
                    <Route path='/' element={<Dashboard/>}/>
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path='/profile' element={<Profile/>}/>
                    <Route path='/customers' element={<Customer/>}/>
                    <Route path='/taxes' element={<Taxes/>}/>
                    <Route path='/invoice' element={<Invoice/>}/>
                    <Route path='/payment' element={<Payment/>}/>
                </Route>

                <Route path='*' element={<NotFound/>}/>


            </Routes>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </>
    )
}

export default App