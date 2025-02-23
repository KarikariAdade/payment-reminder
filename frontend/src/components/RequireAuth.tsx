import {useContext} from "react";
import {AuthContext} from "/src/context/AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";

export const RequireAuth = () => {

    const {token, user, loading} = useContext(AuthContext);


    console.log('require authentication', 'token', token, 'user', user)

    if (loading) return <p>Loading....</p>

    if (!token && !user) {
        return <Navigate to="/auth/login" replace/>;
    }


    return <Outlet/>


}