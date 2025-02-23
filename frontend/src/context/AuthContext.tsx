import {createContext, useEffect, useState} from "react";

export const AuthContext = createContext()

export const AuthContextProvider = (props) => {

    const [token, setToken] = useState(null)

    const [loading, setLoading] = useState(true)

    const [user, setUser] = useState(null)

    useEffect(() => {

        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {

            setToken(storedToken)

            setUser(storedUser ? JSON.parse(storedUser) : null)
        }


        setLoading(false)

    }, [])
    
    const logOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setToken(null)
    }


    const value = {token, user, setToken, setUser, loading, logOut};
    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )

}