
import './App.css'
import {Route, Routes} from "react-router-dom";
import {Login} from "/src/pages/auth/Login.tsx";
import {Register} from "/src/pages/auth/Register.tsx";
import {ForgotPassword} from "/src/pages/auth/ForgotPassword.tsx";
import {Dashboard} from "/src/pages/dashboard/Dashboard.tsx";


function App() {

  return (
      <>

          <Routes>
              <Route path='/auth'>
                  <Route path='login' element={<Login />} />
                  <Route path='register' element={<Register />} />
                  <Route path='forgot/password' element={<ForgotPassword />} />
              </Route>

              <Route path='/dashboard' element={<Dashboard />} />
          </Routes>
      </>
  )
}

export default App
