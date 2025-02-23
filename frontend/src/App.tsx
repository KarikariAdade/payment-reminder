import './App.css'
import {Route, Routes} from "react-router-dom";
import {Login} from "/src/pages/auth/Login.tsx";
import {Register} from "/src/pages/auth/Register.tsx";
import {ForgotPassword} from "/src/pages/auth/ForgotPassword.tsx";
import {Dashboard} from "/src/pages/dashboard/Dashboard.tsx";
import {Bounce, ToastContainer} from "react-toastify";
import {Profile} from "/src/pages/profile/Profile.tsx";
import {RequireAuth} from "/src/components/RequireAuth.tsx";


function App() {

    return (
        <>

            <Routes>
                <Route path='/auth'>
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>
                    <Route path='forgot/password' element={<ForgotPassword/>}/>
                </Route>

                <Route element={<RequireAuth/>}>
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path='/profile' element={<Profile/>}/>
                </Route>


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